const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * 1. Look up the user by email in the `users` table.
 * 2. Compare the submitted password against the stored bcrypt hash.
 * 3. Sign a JWT and return it together with safe user fields.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // 1 ── Fetch user by email
    const { rows } = await query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [email.toLowerCase().trim()],
    );

    if (rows.length === 0) {
      // Don't reveal which field is wrong
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];

    // 2 ── Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 3 ── Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || "dev_secret_change_me",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * JWT is stateless — invalidation is handled client-side.
 * If you add a token blacklist later, do it here.
 */
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me  (protected)
 * req.user is populated by the protect middleware.
 */
const me = async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, me };
