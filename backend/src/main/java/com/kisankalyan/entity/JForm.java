package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.JFormStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "j_form")
public class JForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "j_form_id")
    private Long jFormId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id", referencedColumnName = "entry_id", nullable = false, unique = true)
    private ProcurementEntry entry;

    @Column(name = "j_form_number", nullable = false, unique = true, length = 50)
    private String jFormNumber;

    @Column(name = "issue_date", nullable = false, insertable = false)
    private LocalDate issueDate;

    @Column(name = "document_path", columnDefinition = "TEXT")
    private String documentPath;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private JFormStatus status;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public JForm() {}

    public JForm(Long jFormId, ProcurementEntry entry, String jFormNumber, LocalDate issueDate, String documentPath, JFormStatus status, OffsetDateTime createdAt) {
        this.jFormId = jFormId;
        this.entry = entry;
        this.jFormNumber = jFormNumber;
        this.issueDate = issueDate;
        this.documentPath = documentPath;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getJFormId() { return this.jFormId; }
    public void setJFormId(Long jFormId) { this.jFormId = jFormId; }

    public ProcurementEntry getEntry() { return this.entry; }
    public void setEntry(ProcurementEntry entry) { this.entry = entry; }

    public String getJFormNumber() { return this.jFormNumber; }
    public void setJFormNumber(String jFormNumber) { this.jFormNumber = jFormNumber; }

    public LocalDate getIssueDate() { return this.issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public String getDocumentPath() { return this.documentPath; }
    public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }

    public JFormStatus getStatus() { return this.status; }
    public void setStatus(JFormStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long jFormId;
        private ProcurementEntry entry;
        private String jFormNumber;
        private LocalDate issueDate;
        private String documentPath;
        private JFormStatus status;
        private OffsetDateTime createdAt;

        public Builder jFormId(Long jFormId) { this.jFormId = jFormId; return this; }
        public Builder entry(ProcurementEntry entry) { this.entry = entry; return this; }
        public Builder jFormNumber(String jFormNumber) { this.jFormNumber = jFormNumber; return this; }
        public Builder issueDate(LocalDate issueDate) { this.issueDate = issueDate; return this; }
        public Builder documentPath(String documentPath) { this.documentPath = documentPath; return this; }
        public Builder status(JFormStatus status) { this.status = status; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public JForm build() {
            JForm obj = new JForm();
            obj.jFormId = this.jFormId;
            obj.entry = this.entry;
            obj.jFormNumber = this.jFormNumber;
            obj.issueDate = this.issueDate;
            obj.documentPath = this.documentPath;
            obj.status = this.status;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
