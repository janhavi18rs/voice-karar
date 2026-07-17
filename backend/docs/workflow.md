# Voice Karar System Workflow

This document illustrates the sequence of actions across systems to convert informal voice summaries into digitally accepted contracts.

## Workflow Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Agreement Initiator
    actor Reviewer as Agreement Recipient
    participant App as Mobile/Web Frontend
    participant Backend as Express Backend
    participant AI as AI Processing Service
    participant DB as MongoDB

    Creator->>App: Record Voice Summary & input emails
    App->>Backend: Post Audio / Transcript payload
    Backend->>AI: Delegate transcript parsing
    AI-->>Backend: Yield Structured Fields (parties, quantities, deadlines)
    Backend->>DB: Save agreement (Status: Pending, generate shareId)
    Backend-->>App: Return shareable link (shareId)
    Creator->>Reviewer: Send shareable link
    Reviewer->>App: Open shareable link
    App->>Backend: Retrieve Agreement by shareId (No login req)
    Backend->>DB: Fetch public details
    DB-->>Backend: Return Agreement
    Backend-->>App: Display fields to Reviewer
    alt Reviewer Accepts
        Reviewer->>App: Accept Agreement (Name signature, email check)
        App->>Backend: Accept / Confirm Request
        Backend->>DB: Change status to Accepted, save history & confirmation
        Backend-->>App: Success notification (Email triggered to parties)
    else Reviewer Requests Changes
        Reviewer->>App: Submits comments & parameter changes
        App->>Backend: PATCH Agreement Request
        Backend->>DB: Change status to revision_requested & log change history
        Backend-->>App: Notify creator of changes
    end
```
