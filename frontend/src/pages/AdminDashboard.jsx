import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";
import {
  ShieldCheck,
  Users,
  Store,
  BadgeCheck,
  Search,
  RefreshCw,
  LayoutGrid,
  Sparkles,
  Clock3,
  FileText,
  CircleAlert,
  CheckCircle2,
  Eye,
  ArrowRight,
} from "lucide-react";
import "../styles/AdminDashboard.css";

const statusOptions = ["all", "pending", "under_review", "approved", "rejected"];

const AdminDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [sellerActionId, setSellerActionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  function documentScore(seller) {
    const documents = [
      seller.logo,
      seller.identityDocumentUrl,
      seller.bankStatementUrl,
      seller.liveSelfieUrl,
      seller.authorizationLetterUrl,
      seller.invoiceUrl,
    ].filter(Boolean).length;

    return Math.round((documents / 6) * 100);
  }

  function statusLabel(seller) {
    return seller.verificationStatus || (seller.isApproved ? "approved" : "pending");
  }

  useEffect(() => {
    const token = currentUser?.accessToken;
    if (!token) return;

    axios
      .get(`${API_URL}/auth/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAnalytics(response.data);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    const token = currentUser?.accessToken;
    if (!token) return;

    axios
      .get(`${API_URL}/seller/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setSellers(data);
        if (!selectedSellerId && data.length > 0) {
          setSelectedSellerId(data[0].id);
        }
      })
      .finally(() => setSellerLoading(false));
  }, [currentUser]);

  const refreshSellers = async () => {
    const token = currentUser?.accessToken;
    if (!token) return;

    setSellerLoading(true);
    try {
      const response = await axios.get(`${API_URL}/seller/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setSellers(data);
      if (!selectedSellerId && data.length > 0) {
        setSelectedSellerId(data[0].id);
      }
    } finally {
      setSellerLoading(false);
    }
  };

  const approveSeller = async (sellerId) => {
    const token = currentUser?.accessToken;
    if (!token) return;

    try {
      setSellerActionId(sellerId);
      const response = await axios.patch(
        `${API_URL}/seller/admin/${sellerId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellers((prev) =>
        prev.map((seller) => (seller.id === sellerId ? response.data : seller))
      );
    } finally {
      setSellerActionId(null);
    }
  };

  const rejectSeller = async (sellerId) => {
    const token = currentUser?.accessToken;
    if (!token) return;

    try {
      setSellerActionId(sellerId);
      const response = await axios.patch(
        `${API_URL}/seller/admin/${sellerId}/reject`,
        { verificationNotes: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellers((prev) =>
        prev.map((seller) => (seller.id === sellerId ? response.data : seller))
      );
      setRejectionReason("");
    } finally {
      setSellerActionId(null);
    }
  };

  if (!currentUser || !currentUser.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }

  const selectedSeller = sellers.find((seller) => seller.id === selectedSellerId) || sellers[0] || null;

  const filteredSellers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return sellers.filter((seller) => {
      const sellerStatus = seller.verificationStatus || (seller.isApproved ? "approved" : "pending");
      const matchesStatus = statusFilter === "all" || sellerStatus === statusFilter;
      const matchesSearch =
        !normalizedQuery ||
        seller.shopName?.toLowerCase().includes(normalizedQuery) ||
        seller.user?.username?.toLowerCase().includes(normalizedQuery) ||
        seller.user?.email?.toLowerCase().includes(normalizedQuery) ||
        seller.phone?.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [sellers, searchTerm, statusFilter]);

  const pendingCount = sellers.filter((seller) => {
    const sellerStatus = seller.verificationStatus || (seller.isApproved ? "approved" : "pending");
    return sellerStatus === "pending" || sellerStatus === "under_review";
  }).length;

  const approvedCount = sellers.filter((seller) => seller.isApproved || seller.verificationStatus === "approved").length;
  const rejectedCount = sellers.filter((seller) => statusLabel(seller) === "rejected").length;
  const underReviewCount = sellers.filter((seller) => statusLabel(seller) === "under_review").length;
  const approvalRate = sellers.length ? Math.round((approvedCount / sellers.length) * 100) : 0;
  const averageDocCompleteness = sellers.length
    ? Math.round(sellers.reduce((sum, seller) => sum + documentScore(seller), 0) / sellers.length)
    : 0;
  const recentSellers = [...sellers]
    .sort((left, right) => new Date(right.updatedAt || right.createdAt) - new Date(left.updatedAt || left.createdAt))
    .slice(0, 3);
  const statusBreakdown = [
    { key: "approved", label: "Approved", value: approvedCount, tone: "approved" },
    { key: "pending", label: "Pending", value: pendingCount, tone: "pending" },
    { key: "under_review", label: "Review", value: underReviewCount, tone: "under_review" },
    { key: "rejected", label: "Rejected", value: rejectedCount, tone: "rejected" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__bg" />
      <div className="admin-dashboard__shell container-fluid py-4 py-xl-5">
        <section className="admin-hero">
          <div className="admin-hero__copy">
            <div className="admin-kicker">
              <ShieldCheck size={16} /> Marketplace command center
            </div>
            <h1>Admin Dashboard</h1>
            <p>
              Review seller applications, approve trusted storefronts, and monitor marketplace health from one focused workspace.
            </p>
            <div className="admin-hero__actions">
              <a className="admin-btn admin-btn--primary" href="#seller-approvals">
                Open approval queue
                <ArrowRight size={16} />
              </a>
              <Link className="admin-btn admin-btn--ghost" to="/profile">
                Update profile
              </Link>
            </div>
          </div>
          <div className="admin-hero__panel">
            <div className="admin-orb admin-orb--one" />
            <div className="admin-orb admin-orb--two" />
            <div className="admin-panel-card">
              <div className="admin-panel-card__top">
                <span className="admin-panel-card__eyebrow">Live overview</span>
                <Sparkles size={18} />
              </div>
              <div className="admin-panel-card__metric">
                <strong>{loading || !analytics ? "--" : analytics.totalUsers}</strong>
                <span>Total users</span>
              </div>
              <div className="admin-panel-card__grid">
                <div>
                  <Users size={16} />
                  <strong>{loading || !analytics ? "--" : analytics.customers}</strong>
                  <span>Customers</span>
                </div>
                <div>
                  <Store size={16} />
                  <strong>{loading || !analytics ? "--" : analytics.sellers}</strong>
                  <span>Sellers</span>
                </div>
                <div>
                  <BadgeCheck size={16} />
                  <strong>{approvedCount}</strong>
                  <span>Approved</span>
                </div>
                <div>
                  <Clock3 size={16} />
                  <strong>{pendingCount}</strong>
                  <span>Waiting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card admin-stat-card--accent">
            <div>
              <span>Seller applications</span>
              <strong>{sellers.length}</strong>
            </div>
            <LayoutGrid size={20} />
          </div>
          <div className="admin-stat-card">
            <div>
              <span>Pending review</span>
              <strong>{pendingCount}</strong>
            </div>
            <CircleAlert size={20} />
          </div>
          <div className="admin-stat-card">
            <div>
              <span>Trusted sellers</span>
              <strong>{approvedCount}</strong>
            </div>
            <CheckCircle2 size={20} />
          </div>
          <div className="admin-stat-card">
            <div>
              <span>Marketplace users</span>
              <strong>{loading || !analytics ? "--" : analytics.totalUsers}</strong>
            </div>
            <ShieldCheck size={20} />
          </div>
        </section>

        <section className="admin-insights">
          <div className="admin-insight-card admin-insight-card--wide">
            <div className="admin-section-head">
              <div>
                <span className="admin-section-head__eyebrow">Market pulse</span>
                <h2>Approval breakdown</h2>
              </div>
              <span className="admin-section-head__count">{approvalRate}% approved</span>
            </div>

            <div className="admin-breakdown">
              {statusBreakdown.map((item) => (
                <div className="breakdown-row" key={item.key}>
                  <div className="breakdown-row__top">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="breakdown-row__bar">
                    <span className={`tone-${item.tone}`} style={{ width: `${sellers.length ? Math.max((item.value / sellers.length) * 100, item.value > 0 ? 8 : 0) : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-insight-card">
            <div className="admin-section-head">
              <div>
                <span className="admin-section-head__eyebrow">Quality signal</span>
                <h2>Documents</h2>
              </div>
            </div>

            <div className="signal-gauge">
              <div className="signal-gauge__ring">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f3a847" />
                        <stop offset="100%" stopColor="#111827" />
                      </linearGradient>
                    </defs>
                  <circle cx="60" cy="60" r="46" className="signal-gauge__track" />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    className="signal-gauge__value"
                    style={{ strokeDashoffset: `${289 - (289 * averageDocCompleteness) / 100}` }}
                  />
                </svg>
                <div className="signal-gauge__value-label">
                  <strong>{averageDocCompleteness}%</strong>
                  <span>avg completeness</span>
                </div>
              </div>
              <p>
                Sellers with a complete upload pack move faster through the approval queue.
              </p>
            </div>
          </div>
        </section>

        <section className="admin-spotlight">
          <div className="admin-spotlight__card">
            <div className="admin-section-head">
              <div>
                <span className="admin-section-head__eyebrow">Recent activity</span>
                <h2>Latest seller submissions</h2>
              </div>
            </div>

            {recentSellers.length === 0 ? (
              <div className="admin-empty-strip">No seller activity yet.</div>
            ) : (
              <div className="recent-sellers">
                {recentSellers.map((seller) => (
                  <div className="recent-seller-item" key={seller.id}>
                    <div>
                      <strong>{seller.shopName}</strong>
                      <span>{seller.user?.username || "Unknown owner"}</span>
                    </div>
                    <div className="recent-seller-item__meta">
                      <span className={`seller-status seller-status--${statusLabel(seller)}`}>
                        {statusLabel(seller).replace(/_/g, " ")}
                      </span>
                      <small>{new Date(seller.updatedAt || seller.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-spotlight__card admin-spotlight__card--actions">
            <div className="admin-section-head">
              <div>
                <span className="admin-section-head__eyebrow">Quick actions</span>
                <h2>Workspace shortcuts</h2>
              </div>
            </div>

            <div className="quick-action-grid">
              <a className="quick-action" href="#seller-approvals">
                <CircleAlert size={18} />
                <strong>Review sellers</strong>
                <span>Jump to the approval queue.</span>
              </a>
              <Link className="quick-action" to="/seller">
                <Store size={18} />
                <strong>Seller console</strong>
                <span>Preview the seller-side experience.</span>
              </Link>
              <Link className="quick-action" to="/profile">
                <FileText size={18} />
                <strong>My profile</strong>
                <span>Update your own admin details.</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="admin-workspace">
          <div className="admin-workspace__toolbar">
            <div className="admin-search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search shop, owner, email, or phone"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="admin-filters">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`admin-chip ${statusFilter === option ? "is-active" : ""}`}
                  onClick={() => setStatusFilter(option)}
                >
                  {option === "all" ? "All" : option.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            <button type="button" className="admin-refresh" onClick={refreshSellers}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          <div className="admin-workspace__content" id="seller-approvals">
            <div className="admin-queue">
              <div className="admin-section-head">
                <div>
                  <span className="admin-section-head__eyebrow">Seller approval queue</span>
                  <h2>Applications</h2>
                </div>
                <span className="admin-section-head__count">{filteredSellers.length} visible</span>
              </div>

              {sellerLoading ? (
                <div className="admin-empty-state">Loading sellers...</div>
              ) : filteredSellers.length === 0 ? (
                <div className="admin-empty-state">
                  <FileText size={24} />
                  <strong>No matching seller applications</strong>
                  <span>Try another search term or filter.</span>
                </div>
              ) : (
                <div className="admin-seller-list">
                  {filteredSellers.map((seller) => {
                    const sellerStatus = statusLabel(seller);
                    const isSelected = selectedSeller?.id === seller.id;

                    return (
                      <button
                        key={seller.id}
                        type="button"
                        className={`seller-tile ${isSelected ? "is-selected" : ""}`}
                        onClick={() => setSelectedSellerId(seller.id)}
                      >
                        <div className="seller-tile__top">
                          <div>
                            <h3>{seller.shopName}</h3>
                            <p>{seller.user?.username || "Unknown owner"}</p>
                          </div>
                          <span className={`seller-status seller-status--${sellerStatus}`}>
                            {sellerStatus.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="seller-tile__meta">
                          <span>{seller.user?.email || "No email"}</span>
                          <span>{seller.phone || "No phone"}</span>
                        </div>

                        <div className="seller-progress">
                          <div className="seller-progress__bar">
                            <span style={{ width: `${documentScore(seller)}%` }} />
                          </div>
                          <small>{documentScore(seller)}% document completeness</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="admin-detail-panel">
              <div className="admin-section-head">
                <div>
                  <span className="admin-section-head__eyebrow">Selected seller</span>
                  <h2>Review panel</h2>
                </div>
                {selectedSeller ? (
                  <button
                    type="button"
                    className="admin-link"
                    onClick={() => approveSeller(selectedSeller.id)}
                    disabled={selectedSeller.isApproved || sellerActionId === selectedSeller.id}
                  >
                    {selectedSeller.isApproved ? "Already approved" : sellerActionId === selectedSeller.id ? "Approving..." : "Approve seller"}
                  </button>
                ) : null}
              </div>

              {selectedSeller ? (
                <div className="detail-card">
                  <div className="detail-card__header">
                    <div>
                      <span className="detail-card__label">Shop</span>
                      <h3>{selectedSeller.shopName}</h3>
                      <p>{selectedSeller.address || "No address provided"}</p>
                    </div>
                    <div className={`seller-status seller-status--${statusLabel(selectedSeller)}`}>
                      {statusLabel(selectedSeller).replace(/_/g, " ")}
                    </div>
                  </div>

                  <div className="detail-card__grid">
                    <div>
                      <span>Owner</span>
                      <strong>{selectedSeller.user?.username || "Unknown"}</strong>
                    </div>
                    <div>
                      <span>Email</span>
                      <strong>{selectedSeller.user?.email || "--"}</strong>
                    </div>
                    <div>
                      <span>Phone</span>
                      <strong>{selectedSeller.phone || "--"}</strong>
                    </div>
                    <div>
                      <span>Documents</span>
                      <strong>{documentScore(selectedSeller)}%</strong>
                    </div>
                  </div>

                  <div className="detail-docs">
                    <div className={`doc-pill ${selectedSeller.identityDocumentUrl ? "is-live" : ""}`}>
                      <Eye size={14} /> Identity
                    </div>
                    <div className={`doc-pill ${selectedSeller.bankStatementUrl ? "is-live" : ""}`}>
                      <Eye size={14} /> Bank statement
                    </div>
                    <div className={`doc-pill ${selectedSeller.liveSelfieUrl ? "is-live" : ""}`}>
                      <Eye size={14} /> Live selfie
                    </div>
                    <div className={`doc-pill ${selectedSeller.authorizationLetterUrl ? "is-live" : ""}`}>
                      <Eye size={14} /> Authorization
                    </div>
                    <div className={`doc-pill ${selectedSeller.invoiceUrl ? "is-live" : ""}`}>
                      <Eye size={14} /> Invoice
                    </div>
                  </div>

                  <div className="detail-card__actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--primary"
                      onClick={() => approveSeller(selectedSeller.id)}
                      disabled={selectedSeller.isApproved || sellerActionId === selectedSeller.id}
                    >
                      <BadgeCheck size={16} />
                      {selectedSeller.isApproved ? "Approved" : sellerActionId === selectedSeller.id ? "Approving..." : "Approve now"}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => rejectSeller(selectedSeller.id)}
                      disabled={sellerActionId === selectedSeller.id}
                    >
                      <CircleAlert size={16} />
                      {sellerActionId === selectedSeller.id ? "Rejecting..." : "Reject seller"}
                    </button>
                    <Link className="admin-btn admin-btn--ghost" to="/seller">
                      View seller console
                    </Link>
                  </div>

                  <div className="document-review-grid">
                    <div className="document-review-item">
                      <span>Identity document</span>
                      {selectedSeller.identityDocumentUrl ? (
                        <>
                          <a href={selectedSeller.identityDocumentUrl} target="_blank" rel="noreferrer">Open document</a>
                          <div className="document-preview">
                            {selectedSeller.identityDocumentUrl.match(/\.(png|jpe?g|webp|gif)$/i) ? (
                              <img src={selectedSeller.identityDocumentUrl} alt="Identity document preview" />
                            ) : (
                              <div className="document-preview__file">PDF / file uploaded</div>
                            )}
                          </div>
                        </>
                      ) : (
                        <p>Missing</p>
                      )}
                    </div>

                    <div className="document-review-item">
                      <span>Bank statement</span>
                      {selectedSeller.bankStatementUrl ? (
                        <>
                          <a href={selectedSeller.bankStatementUrl} target="_blank" rel="noreferrer">Open document</a>
                          <div className="document-preview">
                            {selectedSeller.bankStatementUrl.match(/\.(png|jpe?g|webp|gif)$/i) ? (
                              <img src={selectedSeller.bankStatementUrl} alt="Bank statement preview" />
                            ) : (
                              <div className="document-preview__file">PDF / file uploaded</div>
                            )}
                          </div>
                        </>
                      ) : (
                        <p>Missing</p>
                      )}
                    </div>

                    <div className="document-review-item">
                      <span>Live selfie</span>
                      {selectedSeller.liveSelfieUrl ? (
                        <>
                          <a href={selectedSeller.liveSelfieUrl} target="_blank" rel="noreferrer">Open document</a>
                          <div className="document-preview">
                            {selectedSeller.liveSelfieUrl.match(/\.(png|jpe?g|webp|gif)$/i) ? (
                              <img src={selectedSeller.liveSelfieUrl} alt="Live selfie preview" />
                            ) : (
                              <div className="document-preview__file">Video / file uploaded</div>
                            )}
                          </div>
                        </>
                      ) : (
                        <p>Missing</p>
                      )}
                    </div>

                    <div className="document-review-item">
                      <span>Authorization letter</span>
                      {selectedSeller.authorizationLetterUrl ? (
                        <a href={selectedSeller.authorizationLetterUrl} target="_blank" rel="noreferrer">Open document</a>
                      ) : (
                        <p>Optional / missing</p>
                      )}
                    </div>

                    <div className="document-review-item">
                      <span>Wholesale invoice</span>
                      {selectedSeller.invoiceUrl ? (
                        <a href={selectedSeller.invoiceUrl} target="_blank" rel="noreferrer">Open document</a>
                      ) : (
                        <p>Optional / missing</p>
                      )}
                    </div>
                  </div>

                  {selectedSeller.verificationNotes ? (
                    <div className="admin-note-box">
                      <span>Admin note</span>
                      <p>{selectedSeller.verificationNotes}</p>
                    </div>
                  ) : null}

                  <div className="admin-reject-box">
                    <label htmlFor="rejectionReason">Rejection reason</label>
                    <textarea
                      id="rejectionReason"
                      rows="3"
                      value={rejectionReason}
                      onChange={(event) => setRejectionReason(event.target.value)}
                      placeholder="Add a short reason if you reject this seller"
                    />
                  </div>
                </div>
              ) : (
                <div className="admin-empty-state admin-empty-state--tall">
                  <ShieldCheck size={28} />
                  <strong>Select a seller</strong>
                  <span>The detail panel will show documents, status, and the approval action.</span>
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
