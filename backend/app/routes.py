from flask import Blueprint, request, jsonify
from .models import User, Place, Todo, Reminder, db, Restaurant
from datetime import datetime as dt

main = Blueprint('main', __name__)

# --------------------
# 🧭 PLACES
# --------------------

@main.route("/places", methods=["POST"])
def add_place():
    data = request.json
    name = data.get("name")
    type_ = data.get("type")
    user_id = data.get("user_id")

    if not name or not type_ or not user_id:
        return jsonify({"error": "Missing fields"}), 400

    new_place = Place(name=name, type=type_, user_id=user_id)
    db.session.add(new_place)
    db.session.commit()
    return jsonify({"message": "Place added"}), 201

@main.route("/places/<int:user_id>", methods=["GET"])
def get_places(user_id):
    places = Place.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "type": p.type,
        "completed": p.completed
    } for p in places]), 200

@main.route("/places/<int:place_id>/complete", methods=["PUT"])
def toggle_place_complete(place_id):
    place = Place.query.get(place_id)
    if place:
        place.completed = not place.completed
        db.session.commit()
        return jsonify({"message": "Toggled", "completed": place.completed}), 200
    return jsonify({"error": "Place not found"}), 404

@main.route("/places/<int:place_id>", methods=["DELETE"])
def delete_place(place_id):
    place = Place.query.get(place_id)
    if place:
        db.session.delete(place)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Place not found"}), 404

# --------------------
# 🍴 RESTAURANTS
# --------------------

@main.route("/restaurants", methods=["POST"])
def add_restaurant():
    data = request.json
    name = data.get("name")
    user_id = data.get("user_id")

    if not name or not user_id:
        return jsonify({"error": "Missing fields"}), 400

    new_restaurant = Restaurant(name=name, user_id=user_id)
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurant added"}), 201

@main.route("/restaurants/<int:user_id>", methods=["GET"])
def get_restaurants(user_id):
    restaurants = Restaurant.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": r.id,
        "name": r.name,
        "completed": r.completed
    } for r in restaurants]), 200

@main.route("/restaurants/<int:restaurant_id>/complete", methods=["PUT"])
def toggle_restaurant_complete(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant:
        restaurant.completed = not restaurant.completed
        db.session.commit()
        return jsonify({"message": "Toggled", "completed": restaurant.completed}), 200
    return jsonify({"error": "Restaurant not found"}), 404

@main.route("/restaurants/<int:restaurant_id>", methods=["PUT"])
def update_restaurant(restaurant_id):
    data = request.json
    name = data.get("name")

    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant and name:
        restaurant.name = name
        db.session.commit()
        return jsonify({"message": "Updated"}), 200
    return jsonify({"error": "Not found or invalid data"}), 404

@main.route("/restaurants/<int:restaurant_id>", methods=["DELETE"])
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant:
        db.session.delete(restaurant)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Restaurant not found"}), 404

# --------------------
# ✅ TODOS
# --------------------

@main.route("/todos", methods=["POST"])
def add_todo():
    data = request.json
    task = data.get("task")
    user_id = data.get("user_id")

    if not task or not user_id:
        return jsonify({"error": "Missing fields"}), 400

    new_todo = Todo(task=task, user_id=user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"message": "Todo added"}), 201

@main.route("/todos/<int:user_id>", methods=["GET"])
def get_todos(user_id):
    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": t.id,
        "task": t.task
    } for t in todos]), 200

@main.route("/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    data = request.json
    task = data.get("task")

    todo = Todo.query.get(todo_id)
    if todo and task:
        todo.task = task
        db.session.commit()
        return jsonify({"message": "Updated"}), 200
    return jsonify({"error": "Not found or invalid data"}), 404

@main.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if todo:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Todo not found"}), 404

# --------------------
# ⏰ REMINDERS
# --------------------

@main.route("/reminders/<int:user_id>", methods=["GET"])
def get_reminders(user_id):
    reminders = Reminder.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": r.id,
        "note": r.note,
        "datetime": r.datetime.isoformat() if r.datetime else None
    } for r in reminders]), 200

@main.route("/reminders", methods=["POST"])
def add_reminder():
    data = request.json
    note = data.get("note")
    datetime_str = data.get("datetime")
    user_id = data.get("user_id")

    if not note or not user_id or not datetime_str:
        return jsonify({"error": "Missing fields"}), 400

    try:
        reminder_dt = dt.fromisoformat(datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid datetime format"}), 400

    new_reminder = Reminder(note=note, datetime=reminder_dt, user_id=user_id)
    db.session.add(new_reminder)
    db.session.commit()
    return jsonify({"message": "Reminder added"}), 201

@main.route("/reminders/<int:reminder_id>", methods=["PUT"])
def update_reminder(reminder_id):
    data = request.json
    note = data.get("note")
    datetime_str = data.get("datetime")

    reminder = Reminder.query.get(reminder_id)
    if reminder and note and datetime_str:
        try:
            reminder_dt = dt.fromisoformat(datetime_str)
        except ValueError:
            return jsonify({"error": "Invalid datetime format"}), 400

        reminder.note = note
        reminder.datetime = reminder_dt
        db.session.commit()
        return jsonify({"message": "Updated"}), 200
    return jsonify({"error": "Not found or invalid data"}), 404

@main.route("/reminders/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    reminder = Reminder.query.get(reminder_id)
    if reminder:
        db.session.delete(reminder)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Reminder not found"}), 404
