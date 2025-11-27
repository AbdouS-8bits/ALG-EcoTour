import type { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const { email, password } = req.body;
        await signIn('credentials',{ email, password });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'type' in error && (error as any).type === 'credentialsSignin') {
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}