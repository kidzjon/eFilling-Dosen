import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { formatDate } from "../../utils/formatDate";

const statusBadgeClass = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border border-green-200";
    case "rejected":
      return "bg-red-100 text-red-700 border border-red-200";
    default:
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  }
};

const ActivityList = () => {
  const user = useSelector((s) => s.auth.user);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    activityApi.getByDosen(user.id).then(setData);
  }, [user]);

  const columns = [
    { key: "title", label: "Judul" },
    {
      key: "type",
      label: "Jenis",
      render: (row) => row.type,
    },
    {
      key: "date",
      label: "Tanggal",
      render: (row) => formatDate(row.date),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${statusBadgeClass(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Daftar Aktivitas
          </h1>
          <p className="text-sm text-gray-600">
            Semua aktivitas yang telah Anda inputkan.
          </p>
        </div>

        <Button onClick={() => navigate("/dosen/activities/new")}>
          + Tambah Aktivitas
        </Button>
      </div>

      {/* ================= TABLE ================= */}
      <Table
        columns={columns}
        data={data}
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate(`/dosen/activities/${row.id}`)}
            >
              Detail
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(`/dosen/activities/${row.id}/edit`)}
              disabled={row.status === "approved"}
            >
              Edit
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default ActivityList;
