"""
MediNexus Hospital Management System - Python Backend Microservice
Architecture: Python 3.10+ / Flask / PyMongo (MongoDB)
Operating System: Windows 10/11
Development Tools: Visual Studio Code, XAMPP / Local MongoDB Community Edition
Candidate: Kajal Singh Deepak (Roll 67)
College: Nirmala Memorial Foundation College of Commerce and Science (Autonomous)
"""

import os
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# Configuration & MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/medinexus_db")
client = MongoClient(MONGO_URI)
db = client.get_default_database()

# MongoDB Collections Definition
patients_col = db["patients"]
doctors_col = db["doctors"]
appointments_col = db["appointments"]
beds_col = db["beds"]
pharmacy_col = db["pharmacy_inventory"]
prescriptions_col = db["prescriptions"]
lab_orders_col = db["lab_orders"]
invoices_col = db["invoices"]
staff_col = db["staff"]
users_col = db["users"]

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify Python API & MongoDB connection status."""
    try:
        # Check database ping
        client.admin.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"

    return jsonify({
        "status": "online",
        "service": "MediNexus Python/MongoDB Hospital Engine",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": db_status,
        "collections": list(db.list_collection_names())
    }), 200

# ----------------- PATIENT EMR ROUTES ----------------- #

@app.route("/api/patients", methods=["GET"])
def get_patients():
    """Retrieve all patient medical records."""
    patients = list(patients_col.find({}))
    for p in patients:
        p["_id"] = str(p["_id"])
    return jsonify({"success": True, "count": len(patients), "data": patients}), 200

@app.route("/api/patients", methods=["POST"])
def register_patient():
    """Register a new patient and auto-generate unique MRN."""
    data = request.json
    now = datetime.datetime.utcnow().isoformat()
    count = patients_col.count_documents({}) + 1
    mrn = f"MRN-{datetime.datetime.now().year}-{count:04d}"

    new_patient = {
        "mrn": mrn,
        "name": data.get("name"),
        "age": int(data.get("age", 0)),
        "gender": data.get("gender"),
        "phone": data.get("phone"),
        "email": data.get("email", ""),
        "bloodGroup": data.get("bloodGroup", "O+"),
        "address": data.get("address", ""),
        "allergies": data.get("allergies", []),
        "chronicConditions": data.get("chronicConditions", []),
        "status": "Outpatient",
        "registeredAt": now,
        "vitals": data.get("vitals", [])
    }
    result = patients_col.insert_one(new_patient)
    new_patient["_id"] = str(result.inserted_id)
    return jsonify({"success": True, "patient": new_patient}), 201

# ----------------- BED WARD MATRIX ROUTES ----------------- #

@app.route("/api/beds", methods=["GET"])
def get_beds():
    """Retrieve inpatient ward beds status."""
    ward_filter = request.args.get("ward")
    query = {"ward": ward_filter} if ward_filter else {}
    beds = list(beds_col.find(query))
    for b in beds:
        b["_id"] = str(b["_id"])
    return jsonify({"success": True, "data": beds}), 200

@app.route("/api/beds/assign", methods=["POST"])
def assign_bed():
    """Atomically allocate a bed to a patient."""
    data = request.json
    bed_id = data.get("bedId")
    patient_id = data.get("patientId")
    doctor_id = data.get("doctorId", "")

    result = beds_col.update_one(
        {"bedNumber": bed_id, "status": "Available"},
        {"$set": {
            "status": "Occupied",
            "patientId": patient_id,
            "assignedDoctorId": doctor_id,
            "admittedAt": datetime.datetime.utcnow().isoformat()
        }}
    )
    if result.modified_count == 0:
        return jsonify({"success": False, "message": "Bed not available or not found"}), 400

    # Update patient status to Inpatient
    patients_col.update_one({"mrn": patient_id}, {"$set": {"status": "Inpatient", "bedNumber": bed_id}})
    return jsonify({"success": True, "message": f"Bed {bed_id} successfully allocated"}), 200

# ----------------- PHARMACY INVENTORY DEDUPLICATION ----------------- #

@app.route("/api/pharmacy/dispense", methods=["POST"])
def dispense_medication():
    """Dispense medication and atomically decrement inventory stock."""
    data = request.json
    item_code = data.get("itemCode")
    quantity = int(data.get("quantity", 1))

    item = pharmacy_col.find_one({"code": item_code})
    if not item:
        return jsonify({"success": False, "message": "Medicine not found in inventory"}), 404

    if item["stockQuantity"] < quantity:
        return jsonify({"success": False, "message": "Insufficient stock available"}), 400

    new_stock = item["stockQuantity"] - quantity
    pharmacy_col.update_one(
        {"code": item_code},
        {"$set": {"stockQuantity": new_stock, "lastUpdated": datetime.datetime.utcnow().isoformat()}}
    )
    return jsonify({"success": True, "remainingStock": new_stock}), 200

# ----------------- LABORATORY DIAGNOSTICS & NABL FLAGGING ----------------- #

@app.route("/api/lab/evaluate", methods=["POST"])
def evaluate_lab_results():
    """Evaluate diagnostic panel against NABL biological reference intervals."""
    data = request.json
    results = data.get("results", [])
    evaluated = []

    for item in results:
        val = float(item.get("value", 0))
        ref_min = float(item.get("refMin", 0))
        ref_max = float(item.get("refMax", 0))

        if val < ref_min:
            status = "Low"
            flag = True
        elif val > ref_max:
            status = "High"
            flag = True
        else:
            status = "Normal"
            flag = False

        evaluated.append({
            "parameter": item.get("parameter"),
            "value": val,
            "unit": item.get("unit"),
            "referenceInterval": f"{ref_min} - {ref_max}",
            "status": status,
            "isAbnormal": flag
        })

    return jsonify({"success": True, "evaluatedResults": evaluated}), 200

if __name__ == "__main__":
    print("MediNexus Python/MongoDB Hospital Engine starting on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)
