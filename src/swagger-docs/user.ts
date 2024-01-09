/**
 * @swagger
 *  tags:
 *    name: Users
 *    description: The users managing API
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the user
 *        first_name:
 *          type: string
 *          description: First name of user
 *        last_name:
 *          type: string
 *          description: Last name of user
 *        password:
 *          type: string
 *          description: Password created by user that consists of at-least 8 characters, 1 capital, 1 small, 1 numeric and 1 special character
 *        email:
 *          type: string
 *          description: Email address provided by user
 *        contact_no:
 *          type: number
 *          description: 10 digit contact number provided user
 *        user_image:
 *          type: string
 *          description: Image of user
 *        role:
 *          type: string
 *          description: Role of the user
 *        created_at:
 *          type: string
 *          description: Timestamp when user was created
 *        update_at:
 *          type: string
 *          description: Timestamp when user was updated
 *        deleted_at:
 *          type: string
 *          description: Timestamp when user was updated
 * /api/v1/users:
 *  get:
 *     description: Returns a list of users
 *     summary : Summary
 *     tags: [Users]
 *     responses:
 *        200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               users:
 *                 $ref: '#/components/schemas/User'
 *        500:
 *          description: Internal server error
 */
