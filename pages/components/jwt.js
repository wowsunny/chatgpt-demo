import jwt from 'jsonwebtoken';

export function checkIfUserIsLoggedIn(req) {
    const authToken = req.cookies.authToken; // 假设你将用户的认证信息存储在名为 "authToken" 的 cookie 中
    if (!authToken) {
        return false
    }
    // 根据你的应用实现，验证 authToken 是否有效
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET); // 假设你的应用使用了环境变量来存储 JWT 密钥
    const { password, expiresAt } = decoded
    // 根据你的应用实现，验证 decoded 中的信息是否有效
    if (password && Date.now() < (expiresAt || 0)) {
        return true;
    } else {
        return false;
    }
}
export function generateToken(password) {
    const token = jwt.sign({ password, expiresAt: Date.now() + 1000 * 60 * 60 * 24 }, process.env.JWT_SECRET);
    return token
}