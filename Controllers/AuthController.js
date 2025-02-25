const { User, UserRole } = require('../Models/UserModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const LoginUser = async (req, res) => {
    const { credential, client_id } = req.body;

    if (!credential || !client_id) {
        return res.status(400).json({ error: 'Missing credential or client_id' });
    }

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });

        const payload = ticket.getPayload();
        const email = payload?.email;

        if (!email) {
            return res.status(403).json({ message: 'Access denied: unauthorized domain' });
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Create new user if not found
            user = await User.create({ email });
        }

        // Store user session
        req.session.user = { id: user.id, email: user.email };

        return res.json({
            message: 'Login successful',
            data: req.session.user,
        });

    } catch (err) {
        console.error('Error during Google Authentication:', err);
        return res.status(400).json({ error: 'Invalid token or internal error' });
    }
};
const loginExternalUser = async (email, password) => {
    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Generate JWT Token with role
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role,id:user.id }, // Include role in token payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { 
            success: true, 
            message: 'Login successful', 
            token, 
            role: user.role,
            id:user.id  // Include role in response
        };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Server error' };
    }
};


const resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, userId } = req.body;

        
        // const userId = req.user.userId;  

    
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

    
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

    
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await user.update({ password: hashedPassword });

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};





module.exports = {
    LoginUser,loginExternalUser,resetPassword
};
