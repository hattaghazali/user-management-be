const corsOptions = {
    origin: 'http://localhost:5173', // MatchING FE's address
    methods: ['GET', 'POST', 'PATCH', 'PUT'], // Specify the allowed HTTP methods
    credentials: true,
};
export default corsOptions;
