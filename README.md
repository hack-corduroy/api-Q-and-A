# api-Q-and-A
## Requirements Overview
1. Create an API that conforms to the existing API spec (see appendix)
2. Create a database that will house the data served by the API
3. Implement unit tests and integration tests to cover your working service.
4. No loss of uptime when cutting over from legacy API to new service
5. All DB queries should execute in <50ms
6. Implement logging for service

## Database

After considering the options, decided that Postgres was the way to go.
![image](https://user-images.githubusercontent.com/91281587/152913139-f4f008f0-654d-41eb-b84e-50a1e3c715d0.png)


## Speed Testing

My ETL process had to take in 2.3 mb of data. I was using fs.createReadStream to take in the csv files. With trial and error, I discovered that the chunks we were handling cut off at a specific bytes and not at the new line. I then implemented readline to process each and everyline. The first file of 3.86 gb took 54 minutes. With the help of bulk insertion that time went down to 29 seconds. For all the 2.3 mb of data to be inserted after, it took about 4 minutes in total.

Another speed test ran was for the API queries, including get, post, and put. From the photos below we can see the before and after timings after implementing postgres indexing. 

Pre:
![image](https://user-images.githubusercontent.com/91281587/152913870-8df1227f-2bf9-4d93-968a-1600df6b4938.png)

Post:
![image](https://user-images.githubusercontent.com/91281587/152913900-5fc06a80-0ec8-469f-888f-821d99ef8bf9.png)
