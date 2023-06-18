export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({message: "Logout successful"});
    } catch (error) {
        res.status(500).send({error: "Error logging out"});
    }
};