#Set the provider and the project_id
provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

#Create Resource: GKE Cluster
resource "google_container_cluster" "primary" {
  name     = var.gke_cluster_name
  location = var.gcp_region

  initial_node_count = 1

  node_config {
    machine_type = var.gke_machine_type
  }
}

output "kubeconfig" {
  value = google_container_cluster.primary.endpoint
}

#Create Resource: Persistent Disk
resource "google_compute_disk" "my_disk" {
  name  = var.gcp_pd_name
  type  = var.gcp_pd_type
  size  = var.gcp_pd_size
  zone  = var.gcp_region
}
