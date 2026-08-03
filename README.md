# Task 6 - Relationships, Filtering, Sorting, Pagination

This task builds on the JWT auth version of the API. The bookings and services tables were already linked, but this is where that relationship actually gets used - querying bookings by service, sorting and paginating results, and adding a Reviews table tied to services.

## What changed

**Service now has two things attached to it:** bookings (already existed) and reviews (new). A service can have many bookings and many reviews, both through a `serviceId` foreign key.

**GET /bookings got a lot more useful.** Before, it just returned every booking with no way to narrow it down. Now it supports:

- filtering by service name
- sorting by any column, ascending or descending
- pagination with page/limit

**Reviews are new.** Each service can be reviewed - a rating from 1 to 5 and a comment. Two endpoints: one to leave a review, one to see all reviews for a service.

## Bookings - filtering, sorting, pagination

```
GET /bookings
GET /bookings?service=Haircut
GET /bookings?sortBy=date&order=desc
GET /bookings?page=2&limit=5
GET /bookings?service=Haircut&sortBy=date&order=desc&page=1&limit=5
```

| Param | What it does | Default |
|---|---|---|
| service | matches the service name, case-insensitive | none - returns all |
| sortBy | column to sort by (id, date, etc.) | id |
| order | asc or desc | asc |
| page | which page of results | 1 |
| limit | results per page | 10 |

Response includes a pagination block along with the data:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 23,
    "totalPages": 3
  }
}
```

The service filter uses `ILIKE` under the hood so "haircut" and "Haircut" both match - didn't want people to get zero results just because of casing.

## Reviews

```
POST /services/:id/reviews
```
```json
{
  "rating": 5,
  "comment": "loved it, will book again"
}
```

Rating has to be a whole number between 1 and 5, comment can't be empty. If the service ID in the URL doesn't exist, you get a 404 instead of a review attached to nothing.

```
GET /services/:id/reviews
```
Returns all reviews for that service, same 404 if the service isn't real.

Neither of these needs a token right now - reviews aren't behind auth yet.

## Endpoints added this task

| Method | Route | Description | Needs token? |
|---|---|---|---|
| GET | /bookings | now supports service filter, sortBy, order, page, limit | no |
| POST | /services/:id/reviews | leave a review for a service | no |
| GET | /services/:id/reviews | list reviews for a service | no |

## A couple of notes on how this was built

- Pagination math is just `offset = (page - 1) * limit`, nothing fancy.
- `totalPages` comes from `Math.ceil(totalItems / limit)` so the last page isn't cut off if it doesn't divide evenly.
- Sorting takes whatever column name is passed in `sortBy` - fine for now since this is a learning project, but in a real app you'd want to whitelist the allowed columns instead of passing the query param straight to Sequelize.
- Service lookup for the booking filter uses `findAndCountAll` with an `include`, so the count returned is already correct for the filtered set, not the whole table.

## Testing

Tested manually in Postman - filtering by service, sorting both directions, pagination across a few pages, and the review endpoints with valid and invalid service IDs. Screenshots for these are in the `screenshots/` folder (filter-bookings-by-service, sort-bookings-ascending, sort-bookings-descending, pagination-page, pagination-page-2, filtering-and-pagination).

## Author

Ayesha Cheema
github.com/ayeshaacheema
