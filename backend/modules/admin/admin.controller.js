import authService from "./admin.service.js";

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const data = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      const result = await authService.logout(req.user.user_id);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Logout failed",
      });
    }
  }
}

export default new AuthController();
