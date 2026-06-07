// ============================================================
// HS Education — API Configuration
// REACT_APP_API_URL is injected at Docker build time
// Set it in Northflank as a Build Argument:
//   REACT_APP_API_URL=https://p02--hseducation--wd2sd44bwz9b.code.run
// ============================================================
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export default API_URL;
