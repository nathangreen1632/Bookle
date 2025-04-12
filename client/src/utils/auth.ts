class AuthService {
  getToken(): string | null {
    return localStorage.getItem("id_token");
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return Boolean(token);
  }

  login(token: string): void {
    localStorage.setItem("id_token", token);
    window.location.replace("/");
  }

  logout(): void {
    localStorage.removeItem("id_token");
    window.location.replace("/");
  }
}

export default new AuthService();
