const dataSource = require('./dataSource');


const checkPoint = async (userId) => {    

    const [result] = await dataSource.query(`
        SELECT 
            point 
        FROM 
            users 
        WHERE id = ?`,
        [userId]
    )

    return result.point
}

const createOrder = async (userId, reqMessage, address) => {

    await dataSource.query(`
        INSERT INTO orders (
            user_id,
            req_message,
            address
            ) VALUES (
                    ?,
                    ?,
                    ?
            )`,
        [userId, reqMessage, address]
    )

    const orderId = await dataSource.query(`
        SELECT 
            id
        FROM orders
        WHERE user_id = ?`, [userId]
        )

        return orderId[orderId.length-1].id;

}

const getCart= async (userId, productId) => {

    const items = await dataSource.query(`
        SELECT 
            product_id,
            quantity
        FROM 
            carts
        WHERE 
            user_id = ? AND product_id in (?)`
    ,[userId, productId]
    )

    return items;

  }


const createOrderItems = async (orderId, items) => {    

    let tmp = "";
    items.map(el => {
        tmp += `(${orderId}, ${el.product_id}, ${el.quantity}),`
    })
    tmp = tmp.slice(0,-1);

    await dataSource.query(`
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity
            ) VALUES ` + tmp
    )    


    return;
}

const deleteCart = async (userId, productId) => {    

    await dataSource.query(`
        DELETE FROM 
            carts
        WHERE 
            user_id = ? AND 
            product_id in (?)`
        ,
    [userId, productId]
    )    

    return;

}

const deductPoint = async (userId, total) => {    
    
    return await dataSource.query(`
        UPDATE users 
        SET point = point - ? 
        WHERE id = ?`,
        [total, userId]
    )

}

const checkStock = async (productId) => {    

    const result = await dataSource.query(`
    SELECT (
        CASE WHEN 
            p.stock - c.quantity < 0 THEN p.id 
        END) AS productId
    FROM 
        products p 
    INNER JOIN 
        carts c 
        ON p.id = c.product_id 
    WHERE p.id in (?) AND 
        p.stock - c.quantity < 0`, [productId]
    )
    return result;

}


const deleteProductStock = async (productId) => {    

    await dataSource.query(`
        UPDATE 
            products p
        INNER JOIN 
            carts c 
        ON 
            p.id = c.product_id 
        SET 
            p.stock = p.stock - c.quantity
        WHERE p.id in (?)`,[productId]
    )


    return;

}

module.exports = {
    checkPoint,
    createOrder,
    getCart,
    createOrderItems,
    deleteCart,
    deductPoint,
    checkStock,
    deleteProductStock,
}
