package models

import "time"

type User struct {
	ID           string    `json: id, db: id`
	Username     string    `json: username, db: username`
	Email        string    `json: email, db: email`
	PasswordHash string    `json: passwordHash, db: password_hash`
	Bio          string    `json: bio, db: bio`
	AvatarUrl    string    `json: avatar_url, db: avatar_url`
	CreatedAt    time.Time `json: created_at, db: created_at`
	UpdatedAt    time.Time `json: updated_at, db: updated_at`
}
