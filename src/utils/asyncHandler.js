// this is the helper function to handle the async request and catch the error and pass it to the next middleware
const asyncHandler = (requestHandler) => {
    return (req , res , next)=>{
        Promise.resolve(requestHandler(req , res , next)).
        catch((error)=>next(error))
    }
}

export {asyncHandler}


// const asyncHandler = () => {}
// const asyncHandler = (fn) => () =>{}
// const asyncHandler = (fn) => async()=>{}


// const asyncHandler = (fn) => async(req , res , next)=>{
//     try{
//         await fn(req , res , next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.mess
//         })
//     }

// }
