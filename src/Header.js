import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { List } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Amazon } from "react-bootstrap-icons";
import { data, Link } from "react-router";
import {Card} from  "react-bootstrap"; 
import { Col } from "react-bootstrap";
import { Cart, Plus } from "react-bootstrap-icons";

export var products = [
  {
    "id": 1,
    "brand": "Samsung",
    "name": "Galaxy S23",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 2,
    "brand": "Apple",
    "name": "iPhone 15 Pro",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "256GB",
    "camera": "12MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 3,
    "brand": "Xiaomi",
    "name": "Redmi Note 13 Pro+",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 4,
    "brand": "OnePlus",
    "name": "OnePlus 12",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 5,
    "brand": "Oppo",
    "name": "Reno 11 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 6,
    "brand": "Vivo",
    "name": "Vivo V30 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 7,
    "brand": "Realme",
    "name": "Realme 12 Pro+",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "48MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 8,
    "brand": "Google",
    "name": "Pixel 8",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 9,
    "brand": "Motorola",
    "name": "Moto Edge 40 Ultra",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 10,
    "brand": "Sony",
    "name": "Xperia 1 VI",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 11,
    "brand": "Samsung",
    "name": "Galaxy A55",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 12,
    "brand": "Apple",
    "name": "iPhone 15 Pro Max",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "512GB",
    "camera": "12MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 13,
    "brand": "Xiaomi",
    "name": "POCO X6 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 14,
    "brand": "OnePlus",
    "name": "OnePlus Nord 4",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 15,
    "brand": "Oppo",
    "name": "Oppo A79",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "50MP",
    "screen_size": "6.2 inches"
  },
  {
    "id": 16,
    "brand": "Vivo",
    "name": "Vivo Y200e",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.3 inches"
  },
  {
    "id": 17,
    "brand": "Realme",
    "name": "Realme GT 5 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 18,
    "brand": "Google",
    "name": "Pixel 7a",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "6.0 inches"
  },
  {
    "id": 19,
    "brand": "Motorola",
    "name": "Moto G84",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 20,
    "brand": "Sony",
    "name": "Xperia 5 VI",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 21,
    "brand": "Samsung",
    "name": "Galaxy S24 Ultra",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 22,
    "brand": "Apple",
    "name": "iPhone 15 Mini",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "5.4 inches"
  },
  {
    "id": 23,
    "brand": "Xiaomi",
    "name": "Redmi 13",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 24,
    "brand": "OnePlus",
    "name": "OnePlus 12R",
    "category": "Smartphone",
    "ram": "16GB",
    "rom": "512GB",
    "camera": "50MP",
    "screen_size": "6.9 inches"
  },
  {
    "id": 25,
    "brand": "Oppo",
    "name": "Oppo Find X7 Ultra",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "64MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 26,
    "brand": "Vivo",
    "name": "Vivo X100 Pro+",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 27,
    "brand": "Realme",
    "name": "Realme C67",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 28,
    "brand": "Google",
    "name": "Pixel 8 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.2 inches"
  },
  {
    "id": 29,
    "brand": "Motorola",
    "name": "Moto G Power 2024",
    "category": "Smartphone",
    "ram": "4GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.3 inches"
  },
  {
    "id": 30,
    "brand": "Sony",
    "name": "Xperia 10 VI",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "5.9 inches"
  },
  {
    "id": 31,
    "brand": "Samsung",
    "name": "Galaxy S23 FE",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 32,
    "brand": "Apple",
    "name": "iPhone SE (4th Gen)",
    "category": "Smartphone",
    "ram": "4GB",
    "rom": "64GB",
    "camera": "12MP",
    "screen_size": "4.7 inches"
  },
  {
    "id": 33,
    "brand": "Xiaomi",
    "name": "Xiaomi 14 Ultra",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 34,
    "brand": "OnePlus",
    "name": "OnePlus Nord 3",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 35,
    "brand": "Oppo",
    "name": "Reno 10 Pro+",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "48MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 36,
    "brand": "Vivo",
    "name": "Vivo V29 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 37,
    "brand": "Realme",
    "name": "Realme Narzo 70 Pro",
    "category": "Smartphone",
    "ram": "4GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 38,
    "brand": "Google",
    "name": "Pixel 7 Pro",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "256GB",
    "camera": "12MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 39,
    "brand": "Motorola",
    "name": "Moto Edge 50 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 40,
    "brand": "Sony",
    "name": "Xperia Pro-I II",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 41,
    "brand": "Samsung",
    "name": "Galaxy A35",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.2 inches"
  },
  {
    "id": 42,
    "brand": "Apple",
    "name": "iPhone 14 Pro Max",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "12MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 43,
    "brand": "Xiaomi",
    "name": "Redmi Note 12 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "64MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 44,
    "brand": "OnePlus",
    "name": "OnePlus 11R",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 45,
    "brand": "Oppo",
    "name": "Oppo F25 Pro",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 46,
    "brand": "Vivo",
    "name": "Vivo Y100a",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.3 inches"
  },
  {
    "id": 47,
    "brand": "Realme",
    "name": "Realme 11 Pro+",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 48,
    "brand": "Google",
    "name": "Pixel 6a",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.0 inches"
  },
  {
    "id": 49,
    "brand": "Motorola",
    "name": "Moto Edge 30 Ultra",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 50,
    "brand": "Sony",
    "name": "Xperia 5 V",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 51,
    "brand": "Samsung",
    "name": "Galaxy Z Fold6",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "108MP",
    "screen_size": "6.9 inches"
  },
  {
    "id": 52,
    "brand": "Apple",
    "name": "iPhone 14 Pro",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "256GB",
    "camera": "12MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 53,
    "brand": "Xiaomi",
    "name": "Xiaomi 13 Ultra",
    "category": "Smartphone",
    "ram": "16GB",
    "rom": "512GB",
    "camera": "200MP",
    "screen_size": "7.0 inches"
  },
  {
    "id": 54,
    "brand": "OnePlus",
    "name": "OnePlus Open 2",
    "category": "Smartphone",
    "ram": "16GB",
    "rom": "512GB",
    "camera": "64MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 55,
    "brand": "Oppo",
    "name": "Oppo Find N3",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 56,
    "brand": "Vivo",
    "name": "Vivo X Fold 3 Pro",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "64MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 57,
    "brand": "Realme",
    "name": "Realme GT Neo 5 SE",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 58,
    "brand": "Google",
    "name": "Pixel Fold 2",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.3 inches"
  },
  {
    "id": 59,
    "brand": "Motorola",
    "name": "Moto Razr 50 Ultra",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "64MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 60,
    "brand": "Sony",
    "name": "Xperia 1 V",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 61,
    "brand": "Samsung",
    "name": "Galaxy A25",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 62,
    "brand": "Apple",
    "name": "iPhone 14",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 63,
    "brand": "Xiaomi",
    "name": "Redmi Note 13 Pro",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 64,
    "brand": "OnePlus",
    "name": "OnePlus 10 Pro",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 65,
    "brand": "Oppo",
    "name": "Reno 9 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 66,
    "brand": "Vivo",
    "name": "Vivo V27 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 67,
    "brand": "Realme",
    "name": "Realme 10 Pro+",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "48MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 68,
    "brand": "Google",
    "name": "Pixel 6",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 69,
    "brand": "Motorola",
    "name": "Moto Edge 30 Fusion",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 70,
    "brand": "Sony",
    "name": "Xperia 1 IV",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 71,
    "brand": "Samsung",
    "name": "Galaxy A15",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 72,
    "brand": "Apple",
    "name": "iPhone 13 Pro Max",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "512GB",
    "camera": "12MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 73,
    "brand": "Xiaomi",
    "name": "POCO F5",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 74,
    "brand": "OnePlus",
    "name": "OnePlus Nord 2T",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 75,
    "brand": "Oppo",
    "name": "Oppo A59",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "50MP",
    "screen_size": "6.2 inches"
  },
  {
    "id": 76,
    "brand": "Vivo",
    "name": "Vivo Y78+",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.3 inches"
  },
  {
    "id": 77,
    "brand": "Realme",
    "name": "Realme GT Neo 3",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 78,
    "brand": "Google",
    "name": "Pixel 5a",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "6.0 inches"
  },
  {
    "id": 79,
    "brand": "Motorola",
    "name": "Moto G73",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 80,
    "brand": "Sony",
    "name": "Xperia 5 IV",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.1 inches"
  },
  {
    "id": 81,
    "brand": "Samsung",
    "name": "Galaxy S22 Ultra",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 82,
    "brand": "Apple",
    "name": "iPhone 13 mini",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "5.4 inches"
  },
  {
    "id": 83,
    "brand": "Xiaomi",
    "name": "Redmi 12",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 84,
    "brand": "OnePlus",
    "name": "OnePlus 9 Pro",
    "category": "Smartphone",
    "ram": "16GB",
    "rom": "512GB",
    "camera": "50MP",
    "screen_size": "6.9 inches"
  },
  {
    "id": 85,
    "brand": "Oppo",
    "name": "Oppo Find X6 Pro",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "64MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 86,
    "brand": "Vivo",
    "name": "Vivo X90 Pro+",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 87,
    "brand": "Realme",
    "name": "Realme 9 Pro",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "64GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 88,
    "brand": "Google",
    "name": "Pixel 4 XL",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.2 inches"
  },
  {
    "id": 89,
    "brand": "Motorola",
    "name": "Moto G Power (2023)",
    "category": "Smartphone",
    "ram": "4GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.3 inches"
  },
  {
    "id": 90,
    "brand": "Sony",
    "name": "Xperia 10 V",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "128GB",
    "camera": "12MP",
    "screen_size": "5.9 inches"
  },
  {
    "id": 91,
    "brand": "Samsung",
    "name": "Galaxy S21 FE",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 92,
    "brand": "Apple",
    "name": "iPhone SE (3rd Gen)",
    "category": "Smartphone",
    "ram": "4GB",
    "rom": "64GB",
    "camera": "12MP",
    "screen_size": "4.7 inches"
  },
  {
    "id": 93,
    "brand": "Xiaomi",
    "name": "Xiaomi 12S Ultra",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "512GB",
    "camera": "108MP",
    "screen_size": "6.8 inches"
  },
  {
    "id": 94,
    "brand": "OnePlus",
    "name": "OnePlus 8 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 95,
    "brand": "Oppo",
    "name": "Reno 8 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "256GB",
    "camera": "48MP",
    "screen_size": "6.6 inches"
  },
  {
    "id": 96,
    "brand": "Vivo",
    "name": "Vivo V25 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "64MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 97,
    "brand": "Realme",
    "name": "Realme 9i",
    "category": "Smartphone",
    "ram": "4GB",
    "rom": "64GB",
    "camera": "48MP",
    "screen_size": "6.5 inches"
  },
  {
    "id": 98,
    "brand": "Google",
    "name": "Pixel 4a",
    "category": "Smartphone",
    "ram": "6GB",
    "rom": "256GB",
    "camera": "12MP",
    "screen_size": "6.4 inches"
  },
  {
    "id": 99,
    "brand": "Motorola",
    "name": "Moto Edge 20 Pro",
    "category": "Smartphone",
    "ram": "8GB",
    "rom": "128GB",
    "camera": "50MP",
    "screen_size": "6.7 inches"
  },
  {
    "id": 100,
    "brand": "Sony",
    "name": "Xperia Pro",
    "category": "Smartphone",
    "ram": "12GB",
    "rom": "256GB",
    "camera": "50MP",
    "screen_size": "6.5 inches"
  }
];

export const Header = () => {

 const [value, setValue] = useState("");
  const [filterData, setFilterData] = useState([])
  const [shopData,setshopData]=useState(products)

  const searchFunctionality = () => {
     const names = products.filter((products) => {
          return products.title.includes(value)
      });
         console.log("names ",names)
         setFilterData(names)
         console.log("filtred data ",filterData)
         setshopData(names)
    
  }
     
     
    
  
  // const [filter, setFilter] = useState([])

  // const categorySelectFunctionality = () => {
      
  //     const select = products.filter((product) => {
  //           return product.category.includes("Mobiles")
  //        });
  //        console.log("names ",select)
  //        setFilter(select)
  //        console.log(filter)
         
    
  // }
  
  return (
    <>
      <Navbar expand="lg" className="body">
        <Container fluid style={{}}>
          <Amazon />
          <Navbar.Brand href="#">
            <List />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link to="/home">
                <Nav.Link href="#action1">Home</Nav.Link>
              </Link>
              <Link to="/product">
                <Nav.Link href="#action2">Products</Nav.Link>
              </Link>
              <NavDropdown title="Sign-in Options" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Login</NavDropdown.Item>
                <Link to="/sign">
                  <NavDropdown.Item href="#action4">
                    New User?Create an account
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Forget Password?
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Category" id="navbarScrollingDropdown">
                <NavDropdown.Item><Link to="/category/mobiles">Mobiles,Computers</Link></NavDropdown.Item>
                
                  <NavDropdown.Item><Link to="/category/mens">
                    Men's Fashion
                  </Link>
                  </NavDropdown.Item>
                <NavDropdown.Item><Link to ="/category/women">
                  Women's Fashion
                </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action5"><Link to ="/category/kids">
                  Kids
                </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action5"><Link to ="/category/electronics">
                  TV,Appliances,Electronics
                </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled>
                Prime
              </Nav.Link>
              <Link to ="/cart"><Cart/></Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => {
                  setValue(e.target.value);
                  console.log(e.target.value);
                }}
              />
              <Button variant="outline-success" onClick={()=>{searchFunctionality()}}>
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {filterData.map((data) => (
            <Col sm={12} md={3}>
              <Card className="shop" style={{ width: "100%" }}>
                <Card.Img variant="top" src={data.image} className="item" />
                <Card.Body>
                  <Card.Title>{data.title}</Card.Title>
                  <Card.Text>{data.description}</Card.Text>
                  <Card.Text>
                    Price:
                    {data.price >= parseFloat(100.0)
                      ? (data.price * 20) / 100
                      : data.price}
                  </Card.Text>
                  <Button variant="primary">
                    <Plus /> Add Item{" "}
                  </Button>
                  <Button variant="primary">
                    <Cart /> Buy Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
    </>
  );
};
