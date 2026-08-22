/*
  GITHUB-SYNC.JS
  Lets admin.html save content.js directly to your GitHub repo via the
  GitHub REST API, using a Personal Access Token you provide.

  Your token is stored ONLY in this browser's localStorage — it is sent
  directly from your browser to api.github.com and nowhere else.
*/

const GH_CONFIG_KEY = "portfolio_admin_github_config";
const GH_API = "https://api.github.com";

function ghLoadConfig() {
  try {
    const raw = localStorage.getItem(GH_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function ghSaveConfig(cfg) {
  localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(cfg));
}

function ghClearConfig() {
  localStorage.removeItem(GH_CONFIG_KEY);
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function ghHeaders(token) {
  return {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

// Verifies the token + repo combination works and that we can see the repo.
async function ghTestConnection(cfg) {
  const res = await fetch(`${GH_API}/repos/${cfg.owner}/${cfg.repo}`, {
    headers: ghHeaders(cfg.token)
  });
  if (res.status === 200) {
    const data = await res.json();
    return { ok: true, message: `Connected to ${data.full_name} (default branch: ${data.default_branch}).` };
  }
  if (res.status === 404) {
    return { ok: false, message: "Repository not found — check the owner/repo names, or the token doesn't have access to it." };
  }
  if (res.status === 401) {
    return { ok: false, message: "Invalid token, or the token has expired." };
  }
  return { ok: false, message: `GitHub returned an error (status ${res.status}).` };
}

// Looks up the current sha of a file in the repo (needed to update it). Returns null if the file doesn't exist yet.
async function ghGetFileSha(cfg, path) {
  const cacheBuster = Date.now();
  const url = `${GH_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${encodeURIComponent(cfg.branch)}&_=${cacheBuster}`;
  const res = await fetch(url, {
    headers: ghHeaders(cfg.token),
    cache: "no-store"
  });
  if (res.status === 200) {
    const data = await res.json();
    return data.sha;
  }
  if (res.status === 404) return null;
  const errBody = await res.json().catch(() => ({}));
  throw new Error(errBody.message || `Could not check existing file (status ${res.status}).`);
}

// Creates or updates a file in the repo with the given text content.
async function ghSaveFile(cfg, path, fileText, commitMessage, _isRetry) {
  const sha = await ghGetFileSha(cfg, path);
  const url = `${GH_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
  const body = {
    message: commitMessage || `Update ${path} via admin panel`,
    content: utf8ToBase64(fileText),
    branch: cfg.branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(cfg.token), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.status === 200 || res.status === 201) {
    return { ok: true };
  }

  const errBody = await res.json().catch(() => ({}));
  const message = errBody.message || `GitHub returned an error (status ${res.status}).`;

  // sha mismatch (someone/something else touched the file between our GET and PUT) — retry once with a fresh sha.
  if (!_isRetry && res.status === 409 || (!_isRetry && /does not match/i.test(message))) {
    return ghSaveFile(cfg, path, fileText, commitMessage, true);
  }

  return { ok: false, message };
}
