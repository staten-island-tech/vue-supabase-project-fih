interface AuthResponse {
    success: boolean,
    data: {
        uuid: string;
        email: string;
        password: string;
        profile: string
    }
}