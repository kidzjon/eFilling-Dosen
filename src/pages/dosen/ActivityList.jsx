import React, { useEffect, useState } from "react";
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    activityApi
      .getByDosen()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    { key: "title", label: "Judul" },
    {
      key: "category",
      label: "Jenis",
      render: (row) => row.category,
    },
    {
      key: "createdAt",
      label: "Tanggal",
        render: (row) =>
        row.createdAt?.toDate
          ? formatDate(row.createdAt.toDate())
          : "-",
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
      {/* HEADER */}
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

      {/* TABLE */}
      <Table
        columns={columns}
        data={data}
        loading={loading}
        emptyText="Belum ada aktivitas"
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
