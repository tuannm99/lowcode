package main

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// --------------------------------- orm
type Product struct {
	gorm.Model
	Code  string
	Price uint
}

func testOrm() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	// Migrate the schema
	db.AutoMigrate(&Product{})

	// Create
	db.Create(&Product{Code: "D42", Price: 100})

	// Read
	var product Product
	db.First(&product, 1)                 // find product with integer primary key
	db.First(&product, "code = ?", "D42") // find product with code D42

	// Update - update product's price to 200
	db.Model(&product).Update("Price", 200)
	// Update - update multiple fields
	db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // non-zero fields
	db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})

	// Delete - delete product
	db.Delete(&product, 1)
}

// -------------------------------------------- api
// album represents data about a record album.
type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(albums)
}

func getAlbumByID(c *fiber.Ctx) error {
	id := c.Params("id")

	for _, a := range albums {
		if a.ID == id {
			return c.Status(fiber.StatusOK).JSON(a)
		}
	}
	return nil
}

func postAlbums(c *fiber.Ctx) error {
	var newAlbum album

	albums = append(albums, newAlbum)
	return c.Status(fiber.StatusCreated).JSON(albums)
}

func main() {
	app := fiber.New()

	app.Get("/albums", getAlbums)
	app.Get("/albums/:id", getAlbumByID)
	app.Post("/albums", postAlbums)

	app.Listen(":8080")
}
