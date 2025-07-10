const newResponse=(status,message, data)=>{
    res.status(status).json({message:message,data:data})
}
export default newResponse;