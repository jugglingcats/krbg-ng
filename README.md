- Add unsubscribe link to welcome and other emails

```
SITE_URL: https://krbg.uk
GET /verify -> CheckEmailByKey
GET /turnout -> Turnout
POST /signup -> Signup
POST /resendEmail -> ResendEmail
POST /unsubscribe -> Unsubscribe
POST /storeOption -> StoreOption
POST /storeTimeOption -> StoreTimeOption **
POST /storeHoliday -> StoreHoliday
POST /storeFriends -> StoreFriends
POST /storeUserDetails -> StoreUserDetails
POST /sendCustomEmail -> SendCustomEmail
---
POST /sendBeginWeekEmail -> BeginWeek
POST /rollUsers -> RollUsers
POST /sendReminderEmail -> SendReminder
POST /sendFinalEmail -> SendFinalEmail
CronBeginWeek
CronRollUsers
CronSendReminderEmail
CronSendFinalEmail
```