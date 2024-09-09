variable "gcp_project_id"{
    type=string
    description="Name of GCP project where resources wil be created"
}

variable "gcp_region"{
    type=string
    description="Region of GCP Resources"
}

variable "gke_cluster_name"{
    type=string
    description="Name of the GKE cluster"
}

variable "gke_machine_type"{
    type=string
    description=" Machine type for GKE node"
}

variable "gcp_pd_name"{
    type=string
    description="Name of persistent disk"
}

variable "gcp_pd_type"{
    type=string
    description="Type of persistent disk"
}

variable "gcp_pd_size"{
    type=number
    description="Size of persistent disk"
}