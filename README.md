# Blog_API
 through this API a user can have acceess to saved and published articles.

# Requirements
 * User must be able to signup and login
 * logged in user must generate token
 * token generated must expire after 1 hour
 * authenticated user must be able to create posts
 * Posts created must first be in draft state
 * authenticated user must be able to update his/her articles from draft to published
 * authenticated user must be able to delete and edit his/her own articles
 * test application 
 * if a single blog is requested, the api should return the user 
 information(the author) with the blog. The read_count of the blog too should be updated by 1
 * Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
 * The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, default it to 20 blogs per page
 * It should also be searchable by author, title and tags.
 * It should also be orderable by read_count, reading_time and timestamp
 * a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1

 # User

| Field   | Data_type    | constraint       |
|---------|--------------|------------------|
|Firstname| String       | Required         |
|Lastname | String       | Required         |
|Email    | String       | required, unique |
|password | Number       | required         |

# Blog

| Field        | Data_type    | constraint       |
|--------------|--------------|------------------|
|Title         | String       | Required, unique |
|description   | String       | none             |
|author        | String       | none             |
|state         | string       | draft/ published |
|readcount     | number       | none             |
|reading time  | number       | none             |
|tags          | String       | none             |
|body          | string       | none             |
|time stamp    | date         | none             |