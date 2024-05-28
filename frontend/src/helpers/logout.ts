function logout() {
  // Remove cookie "token"
  document.cookie = "token=; Max-Age=0; path=/";
}

export default logout;
