const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


//signup endpoint
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    
        // Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, email: user.email } });
    }};

    //login endpoint
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findone({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Check password
    const Match = await bcrypt.compare(password, user.password);
    if (!Match) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}