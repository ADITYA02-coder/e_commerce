const DEFAULT_API_BASE_URL =
  import.meta.env.PROD ? "" : "http://localhost:8090";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export const API_URL = `${API_BASE_URL}/api`;
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

export const getAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${UPLOADS_URL}/${assetPath.replace(/^\//, "")}`;
};

export default API_BASE_URL;
