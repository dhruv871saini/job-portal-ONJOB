
export const errorResponse = (res, status, message, data) => {
    res.status(status).json({
        status: "Failed",
        message,
        data
    });
};

export const successResponse = (res, status, message, data) => {
    res.status(status).json({
        status: "Success",
        message,
        data
    });
};
