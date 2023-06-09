# Chat Data Service

This repository is a proof of concept for a data service implemented in NestJS. It covers the basic implementation of request aggregation and error handling.

Read more about data services here: [Data Services](https://javaadpatel.com/data-services-for-improving-database-performance/)

## View the data in the mysql database

Exec into docker container `docker exec -it chat-data-service-mysql-1 sh`

Log into mysql console `mysql -uroot -ppassword chat`

Full command: `docker exec -it chat-data-service-mysql-1 mysql -uroot -ppassword chat`

Execute the seeding script manually: `mysql -uroot -ppassword chat < /docker-entrypoint-initdb.d/init.sql`

Run the artillery test:
`artillery run message-load-test.yml`

## Results
### Standard message querying endpoint
Run the artillery test:
`artillery run message-load-test.yml`

When executing the load test against the non-coalesced endpoint. The results were:
--------------------------------
Summary report @ 13:35:52(+0200)
--------------------------------

http.codes.200: ................................................................ 3000
http.request_rate: ............................................................. 100/sec
http.requests: ................................................................. 3000
http.response_time:
  min: ......................................................................... 2000
  max: ......................................................................... 2026
  median: ...................................................................... 2018.7
  p95: ......................................................................... 2018.7
  p99: ......................................................................... 2018.7
http.responses: ................................................................ 3000
vusers.completed: .............................................................. 3000
vusers.created: ................................................................ 3000
vusers.created_by_name.Get messages by channelId: .............................. 3000
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 2001.4
  max: ......................................................................... 2026.7
  median: ...................................................................... 2018.7
  p95: ......................................................................... 2018.7
  p99: ......................................................................... 2018.7

### Coalesced message querying endpoint
Run the artillery test:
`artillery run coalesced-message-load-test.yml`

When executing the load test against the coalesced endpoint. The results were:
--------------------------------
Summary report @ 13:54:38(+0200)
--------------------------------

http.codes.200: ................................................................ 3000
http.request_rate: ............................................................. 100/sec
http.requests: ................................................................. 3000
http.response_time:
  min: ......................................................................... 12
  max: ......................................................................... 2017
  median: ...................................................................... 1022.7
  p95: ......................................................................... 1901.1
  p99: ......................................................................... 1978.7
http.responses: ................................................................ 3000
vusers.completed: .............................................................. 3000
vusers.created: ................................................................ 3000
vusers.created_by_name.Get messages by channelId: .............................. 3000
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 12.6
  max: ......................................................................... 2018.5
  median: ...................................................................... 1022.7
  p95: ......................................................................... 1901.1
  p99: ......................................................................... 1978.7
