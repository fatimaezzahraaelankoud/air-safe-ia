# backend/app/services/auth_service.py
from app.db.mongodb import user_collection
from app.core.security import hash_password, verify_password, create_access_token


async def register_user(user):
    existing = await user_collection.find_one({"email": user.email})

    if existing:
        return {"error": "Utilisateur déjà existant"}

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)

    result = await user_collection.insert_one(user_dict)

    return {
        "message": "Compte créé avec succès",
        "user_id": str(result.inserted_id)
    }


async def login_user(user):
    db_user = await user_collection.find_one({"email": user.email})

    if not db_user:
        return {"error": "Identifiants incorrects"}

    if not verify_password(user.password, db_user["password"]):
        return {"error": "Identifiants incorrects"}

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "email":   db_user["email"],
        "name":    db_user.get("name", ""),
    })

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user_id":      str(db_user["_id"]),
        "name":         db_user.get("name", ""),     # ← nom pour le frontend
        "email":        db_user.get("email", ""),
    }