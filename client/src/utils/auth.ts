class AuthService {
  getToken() {
    return localStorage.getItem("id_token");
  }

  loggedIn() {
    const token = this.getToken();
    return token ? true : false;
  }

  login(token: string) {
    localStorage.setItem("id_token", token);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new AuthService();
