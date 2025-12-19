import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicFetch } from "../../api/public";
// ✅ 1. Import yang dibutuhkan (Auth & Client API)
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import Navbar from "../../components/Navbar";
