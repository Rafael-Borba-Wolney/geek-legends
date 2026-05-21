import jwt from 'jsonwebtoken';

export function autenticarToken(req, res, next) {
    // Espera: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: 'Token inválido.' });
        req.usuario = usuario; // Adiciona os dados (id, email, ehAdmin) no req
        next();
    });
}

// Somente para administradores
export function somenteAdmin(req, res, next) {
    if (!req.usuario?.ehAdmin) {
        return res.status(403).json({ erro: 'Acesso restrito para administradores.' });
    }
    next();
}           