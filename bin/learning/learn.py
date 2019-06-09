from pymongo import MongoClient
db = MongoClient().aggregation_example
result = db.items.find({});

result.inserted_ids
[ObjectId('...'), ObjectId('...'), ObjectId('...'), ObjectId('...')]