
# Microservices Deployment in Google Kubernetes Engine (GKE)

## Overview

**Microservices Deployment in GKE** is a cloud-native application that demonstrates the deployment and orchestration of microservices using Google Kubernetes Engine (GKE) on Google Cloud Platform (GCP).

### Technologies Used

- **Microservices:** Developed using `Node.js`.
- **Containerization:** `Docker`
- **CI/CD:** `GCP Cloud Build`
- **Container Registry:** `GCP Artifact Registry`
- **Kubernetes Cluster:** `Google Kubernetes Engine (GKE)`
- **Infrastructure as Code (IaC):** `Terraform` to automate the provisioning of infrastructure.

## Architecture

The application consists of two microservices running as containers, deployed in a GKE cluster. Kubernetes Persistent Volume (PV) is used for file storage.

![Architecture](https://github.com/user-attachments/assets/7b1f61f4-0267-47e6-a28a-dcd44e01c8a2)

### Container 1
- Accepts file name and data (product and amount) in the request body.
- Stores this data as a file on the cluster's persistent volume.
- Acts as a gateway, performing validation and makes an API call to Container 2 to calculate the sum for a specific product. The sum is then returned.

- **API Endpoints**:
  - **`/store-file`**:
    - **JSON Input**:
      ```json
      {
        "file": "file.dat",
        "data": "product, amount \nwheat, 10\nwheat, 20\noats, 5"
      }
      ```
    - **Output (Success)**:
      ```json
      {
        "file": "file.dat",
        "message": "Success."
      }
      ```

  - **`/calculate`**:
    - **JSON Input**:
      ```json
      {
        "file": "file.dat",
        "product": "wheat"
      }
      ```
    - **Output (Success)**:
      ```json
      {
        "file": "file.dat",
        "sum": 30
      }
      ```

### Container 2

- Listens for requests from Container 1 with the `file` and `product` in the request body
- Retrieves the file with the given name from the cluster's persistent volume.
- Calculates the sum of amounts for the specified product.
- Returns the total sum to Container 1.
- If the file is not found or is not in JSON format, returns an appropriate error message which Container 1 then relays to the user.

## Infrastructure Setup and Deployment

### 1. Artifact Registry Setup
- Created two Artifact Registry repositories in GCP:
  - `csci5409k8app1` for Container 1
  - `csci5409k8app2` for Container 2
- **Purpose:** Store and manage Docker images for each microservice
- **Benefits:** Centralized image management, versioning, and seamless integration with GKE

![Artifact Registry](https://github.com/user-attachments/assets/6f784761-06fd-4a1c-9149-c97035e71d80)

### 2. Cloud Build Configuration
- **Trigger Setup:** Configured Cloud Build to automatically trigger the CI/CD pipeline whenever changes are pushed to the main branch of the repository. This setup is defined in the `cloudbuild.yaml` file located in the root of the repository.

![1](https://github.com/user-attachments/assets/117f208f-f457-4b0d-ab69-0ff6e13db121)

![2](https://github.com/user-attachments/assets/a069e31b-e6ad-4190-b729-294a6469e6b3)

- **Build Process:**
  1. Builds Docker images for both containers
  2. Pushes images to respective Artifact Registry repositories
- **Deployment Workflow:**
  1. Sets up Persistent Volume (PV) and Persistent Volume Claim (PVC) using the `deployment.yaml` file in the root of the repository.
  2. Fetches Kubernetes cluster credentials
  3. Deploys Container 1 using `container1-deployment.yaml` in the `Container 1` directory.
  4. Deploys Container 2 using `container2-deployment.yaml`
- **Key Feature:** Automated CI/CD pipeline ensuring consistent builds and deployments

### 3. Kubernetes Cluster and Persistent Disk Provisioning
- **Environment:** Utilized Google Cloud Shell for infrastructure setup
- **Process:**
  1. Copied Terraform (`.tf`) configuration files from GitHub repository
  2. Initialized Terraform working directory with `terraform init`

![Cluster](https://github.com/user-attachments/assets/86423f87-3879-45e2-8c2c-037df98c2ca9)

  3. Provisioned infrastructure using `terraform apply`
  
![Provision Resources](https://github.com/user-attachments/assets/ee43b87b-9abf-4600-9885-d88fc4295b82)

- **Resources Created:**
  - GKE cluster

![Cluster Created](https://github.com/user-attachments/assets/ea72cc00-e40b-4b38-867d-46f814f9dd03)

  - Standard persistent disk for shared data storage

![Disk](https://github.com/user-attachments/assets/855cb55a-cdcc-4cfb-b91a-26942b142467)

### 4. Continuous Deployment (CD) via Cloud Build
- **Trigger:** Automated deployment is triggered by pushes to the `main` branch of the GitHub repository.
- **Pipeline Steps:**
  1. **Build:** Create new Docker images for both microservices.
  2. **Push:** Upload the updated Docker images to their respective Artifact Registry repositories.
  3. **Deploy PV and PVC:** Set up Persistent Volume (PV) and Persistent Volume Claim (PVC) using `deployment.yaml`.
  4. **Deploy Microservices:**
     - Deploy Container 1 with a `Load Balancer` service for public access.
     - Deploy Container 2 with a` ClusterIP` service for internal communication within the cluster.

![Pipeline](https://github.com/user-attachments/assets/a23b59db-411e-40ed-9e68-9bb46afc8618)

### 5. Deployment to Kubernetes

The deployment of microservices to the Kubernetes cluster is triggered by commits to the `main` branch. The pipeline orchestrates the setup of services within the cluster. The following provide a detailed view of the deployment status:

- **Active Workloads**

![Serviices Deployed](https://github.com/user-attachments/assets/54766bba-b788-4a7a-b661-cf7e6b73a078)

- **Running Pods**

![Pods](https://github.com/user-attachments/assets/0ee23c45-8053-4cb7-8c34-e85cd82ec406)

- **Service IP Exposed by Container 1:**

![Exposing Service](https://github.com/user-attachments/assets/8ff65862-1015-44e5-b3ba-8652e771fd63)

## Testing with Postman

Upon hitting the exposed IP at the endpoints, we get the following results:

### Store File Endpoint (`/store-file`)

- **Successful Upload:**

![Successful Upload](https://github.com/user-attachments/assets/0cd7efe7-f74d-41b2-a48c-e41626e43c42)

- **Missing File Name:**

![File Name Missing](https://github.com/user-attachments/assets/b89b1faa-2083-446d-aede-7d327a94445e)

### Calculate Endpoint (`/calculate`)

- **Successful Calculation:**

![Successful Calculation](https://github.com/user-attachments/assets/ffc26623-ff6a-4f18-bb56-563a5b7b95b3)

- **File Not Found:**

![File Not Found](https://github.com/user-attachments/assets/3b7995bb-1103-412c-b092-c2e102c22151)

- **File not in CSV Format:**

![Invalid File Format](https://github.com/user-attachments/assets/5c6be0ed-52f4-46d8-a215-029b120ca3d6)

![Invalid File Format](https://github.com/user-attachments/assets/048ad52c-aac9-475d-9fcc-d315b58b6437)




