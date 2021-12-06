import React, {useEffect, useState} from 'react'
import {Api as api} from '../Api'

const Comments = () => {
    const [comments, setComments] = useState([])

    useEffect(() =>{
        async function getAllComments(){
            let res = await api.request(`feedback`)            
            setComments(res)
        }
        getAllComments()
    },[])

    return(
        <div>
            <h1>User Feedback:</h1>
            {comments.map(comment => (
                <div> 
                    {comment.comment}
                    from
                    User: {comment.userId} @ {comment.createdAt}
                </div>
            ))}
        </div>
    )
}

export default Comments