# cli-migration


##### Creating environment variables file

> Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For example:

```bash
DB_HOST=localhost
DATABASE_URL=postgresql://localhost:${PORT}/${DATABASE_NAME}
```

##### Install package as dev dependency

> npm install --save-dev postgres-migration

##### Usage 

> ### `structure`

```bash
.
+-- node_modules
+-- src
|   +-- *.js
+-- sql
|   +-- 001-create-user-table.sql
|   +-- 002-alter-user-table.sql
+-- index.html
+-- package.json
```

###### In terminal

```bash
postgres-migration
```

You can do a few things like:

* checking the current migration index `postgres-migration index`
* set the current migration index using `postgres-migration seed 7`
* run some sql using using `postgres-migration execute "select * from your_table" `

or add this in your `package.json` file.

```json
{
  "script": {
      "migrate": "postgres-migration"
  }
}
```

###### run following command to excute

> npm run migrate


## Author

👤 **Thabang Gideon Magaola**

* Website: https://gideon877.github.io/portfolio/
* Twitter: [@gideon877](https://twitter.com/gideon877)
* Github: [@gideon877](https://github.com/gideon877)
* LinkedIn: [@gideon877](https://linkedin.com/in/gideon877)

## Show your support

Give a ⭐️ if this project helped you!

## Contributors

👤 **Andre Vermeulen**

* Github: [@avermeulen](https://github.com/avermeulen)


