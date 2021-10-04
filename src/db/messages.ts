/**
 * A data type (or template) for responses which update the database
 */
 export interface MessageResponse{
    status: number,
    message: string, 
    success: boolean,
    [key: string]: any // for response with body 
}

/**
 * a template for all responses
 */
export const messages = {

    /**
     * Default template for a success response
     * @param message : the message
     * @param type : the name of the property we want to pass in the response body. For example, after creating a user, we want to to return a property call user 
     * @param entity : the value of the custom property
     * @returns A response 
     */
    successMessage<T>(message: string, type: string, entity: T): MessageResponse{
        return{
            status: 200,
            success: true,
            message: message,
            [type]: entity
        }
    },

    createdMessage<T>(message: string, type: string, entity: T): MessageResponse{
        return{
            status: 201,
            success: true,
            message: message,
            [type]: entity
        }
    },

    /**
     * Default response for unauthorized requests
     * @returns a mutation response
     */
    notAuthorized():MessageResponse{
        return{
            status: 401,
            success: false,
            message: 'Unauthorized access',
        }
    },
    
    /**
     * Default response for error requests
     * @param message Detail of the error 
     * @returns 
     */
    internalError(message: string):MessageResponse{
        return{
            status:501,
            success: false,
            message: message
        }
    }
}