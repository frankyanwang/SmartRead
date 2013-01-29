#!/bin/sh

# collect stories from RSS and story in MongoDB.
node data_store/feedinsert.js

# collect stories from posts collection to top_stories collection.
cd story_rcm
java -classpath lib/story_rcm.jar:lib/mongo-2.10.1.jar:lib/log4j-api-2.0-beta3.jar:lib/log4j-core-2.0-beta3.jar:lib/log4j-flume-ng-2.0-beta3.jar:lib/log4j-jcl-2.0-beta3.jar:lib/log4j-slf4j-impl-2.0-beta3.jar:lib/log4j12-api-2.0-beta3.jar:lib/log4j-core-2.0-beta3-tests.jar:lib/fudannlp.jar:lib/commons-cli-1.2.jar:lib/trove.jar:log4j2/ -Xmx1g smartread.db.DBStory
