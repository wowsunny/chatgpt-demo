import { generateToken } from '../components/jwt'

export default async function (req, res) {
    const password = req.body.password || [];
    if (typeof password !== 'string' || !password.length) {
        res.status(400).json({
            error: {
                message: "Please enter a valid password",
            }
        });
        return;
    }
    if (password !== process.env.TEMP_PASSWORD) {
        res.status(400).json({
            error: {
                message: "password incorrect！",
            }
        });
        return;
    }
    res.setHeader('Set-Cookie', `authToken=${generateToken(password)}`);
    res.status(200).json({ result: true });
}

