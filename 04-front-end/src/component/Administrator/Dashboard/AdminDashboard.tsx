import React from "react";

import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="row">
            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Categories</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/category/list">List all</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Orders</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                        <Link className="btn btn-primary" to="/admin/dashboard/order/list/new">List all</Link>
                        </div>
                    </div>
                </div>
            </div>

           


            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Administrators</h2>
                        </div>
                        <div className="card-text">
                            <div className="btn-group w-100">
                                <Link className="btn btn-primary" to="/admin/dashboard/administrator/list">List all</Link>
                                <Link className="btn btn-success" to="/admin/dashboard/administrator/add">
                                      Add
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
}