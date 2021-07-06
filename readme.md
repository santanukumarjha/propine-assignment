## Question 2 problem solution
    Transactions.csv can be loaded to any data store:
        1. Load it to fast searching data store i.e. ElasticSearch.
        2. Load it to SQL(i.e. MYSQL) or NO-SQL(i.e. MongoDB) data store.
# Loading Data store to ElasticSearch
    ElasticSearch stack(i.e. ELK)
        1. Elastisearch (Data store)
            Elastisearch in windows is hosted as service
        2. LogStash (Pumps data to data store) : To pump data to data store below configuration is required:
        ```
        input {
            file {
                path => "C:/propine/transactions.csv"
                start_position => "beginning"
                sincedb_path => "NULL"
            }
        }

        filter {
            csv {
            separator => ","
            columns => ["timestamp","transaction_type","token","amount"]
            }
        }
        output {
        elasticsearch {
            hosts => "http://localhost:9200"
            index => "transactions_record"
        }
        }
        ```
        Once the configuration is set below command can be used to start the Logstash.
        ```
        .\bin\logstash.bat -f .\config\syslog.conf
        ```
        Below api endpoint to be executed to enable aggregation
        ```
        PUT transactions_record/_mapping/
        {
        "properties": {
            "timestamp": { 
            "type":     "text",
            "fielddata": true
            }
        }
        }
        ```
        3. Kibana (Dashboard to visualize the data)
        Unzip the kibana zip file and it will be started using below command
        ```
        ./bin/kibana
        ```

# Loading Data Store to NO-SQL data Store
    To load into NO-SQL data store below command needs to be executed
    ```
    mongoimport --drop -d myDatabase -c myCollection --type csv --fields name --file myFile.csv
    ```
# commands
    1. Given no parameters, return the latest portfolio value per token in USD
    ```
    node index.js
    ```
    2. Given a token, return the latest portfolio value for that token in USD
    ```
    node index.js --token BTC
    ```
    3. Given a date, return the portfolio value per token in USD on that date
    ```
    node index.js --date 1571966641
    ```
    4. Given a date and a token, return the portfolio value of that token in USD on that date
    ```
    node index.js --token BTC --date 1571966641
    ```
