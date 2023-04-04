
# View the data in the mysql database

Exec into docker container `docker exec -it chat-data-service-mysql-1 sh`

Log into mysql console `mysql -uroot -ppassword chat`

Full command: `docker exec -it chat-data-service-mysql-1 mysql -uroot -ppassword chat`

Execute the seeding script manually: `mysql -uroot -ppassword chat < /docker-entrypoint-initdb.d/init.sql`

Run the artillery test:
`artillery run message-load-test.yml`
