"""
Default radiology report templates
These will be seeded into the database on first run
"""

DEFAULT_TEMPLATES = [
    {
        "name": "Chest X-Ray",
        "description": "Standard chest radiograph template",
        "template_type": "chest_xray",
        "is_public": True,
        "structure": {
            "clinical_indication": {
                "type": "text",
                "description": "Reason for examination"
            },
            "technique": {
                "type": "text",
                "description": "Imaging technique used"
            },
            "comparison": {
                "type": "text",
                "description": "Previous studies for comparison"
            },
            "findings": {
                "lungs": {
                    "type": "text",
                    "description": "Lung parenchyma findings"
                },
                "heart": {
                    "type": "text",
                    "description": "Cardiac silhouette"
                },
                "mediastinum": {
                    "type": "text",
                    "description": "Mediastinal structures"
                },
                "pleura": {
                    "type": "text",
                    "description": "Pleural spaces"
                },
                "bones": {
                    "type": "text",
                    "description": "Osseous structures"
                }
            },
            "impression": {
                "type": "text",
                "description": "Summary and conclusions"
            }
        }
    },
    {
        "name": "CT Brain",
        "description": "CT scan of the brain template",
        "template_type": "ct_brain",
        "is_public": True,
        "structure": {
            "clinical_indication": {
                "type": "text",
                "description": "Clinical reason for scan"
            },
            "technique": {
                "type": "text",
                "description": "CT technique and contrast"
            },
            "comparison": {
                "type": "text",
                "description": "Prior studies"
            },
            "findings": {
                "brain_parenchyma": {
                    "type": "text",
                    "description": "Brain tissue appearance"
                },
                "ventricles": {
                    "type": "text",
                    "description": "Ventricular system"
                },
                "extra_axial_spaces": {
                    "type": "text",
                    "description": "Subdural, epidural, subarachnoid spaces"
                },
                "skull": {
                    "type": "text",
                    "description": "Calvarium and skull base"
                },
                "vessels": {
                    "type": "text",
                    "description": "Vascular structures if visualized"
                }
            },
            "impression": {
                "type": "text",
                "description": "Diagnostic impression"
            }
        }
    },
    {
        "name": "Abdominal CT",
        "description": "CT abdomen and pelvis template",
        "template_type": "ct_abdomen",
        "is_public": True,
        "structure": {
            "clinical_indication": {
                "type": "text",
                "description": "Reason for examination"
            },
            "technique": {
                "type": "text",
                "description": "CT protocol and contrast phases"
            },
            "comparison": {
                "type": "text",
                "description": "Previous imaging"
            },
            "findings": {
                "liver": {
                    "type": "text",
                    "description": "Hepatic findings"
                },
                "gallbladder": {
                    "type": "text",
                    "description": "Gallbladder and biliary tree"
                },
                "pancreas": {
                    "type": "text",
                    "description": "Pancreatic findings"
                },
                "spleen": {
                    "type": "text",
                    "description": "Splenic findings"
                },
                "kidneys": {
                    "type": "text",
                    "description": "Renal findings"
                },
                "bowel": {
                    "type": "text",
                    "description": "Gastrointestinal findings"
                },
                "vessels": {
                    "type": "text",
                    "description": "Vascular structures"
                },
                "lymph_nodes": {
                    "type": "text",
                    "description": "Lymphadenopathy"
                }
            },
            "impression": {
                "type": "text",
                "description": "Summary and recommendations"
            }
        }
    },
    {
        "name": "MRI Spine",
        "description": "MRI spine examination template",
        "template_type": "mri_spine",
        "is_public": True,
        "structure": {
            "clinical_indication": {
                "type": "text",
                "description": "Clinical indication"
            },
            "technique": {
                "type": "text",
                "description": "MRI sequences and technique"
            },
            "level_examined": {
                "type": "text",
                "description": "Cervical/Thoracic/Lumbar/Entire"
            },
            "comparison": {
                "type": "text",
                "description": "Prior studies"
            },
            "findings": {
                "alignment": {
                    "type": "text",
                    "description": "Spinal alignment"
                },
                "vertebral_bodies": {
                    "type": "text",
                    "description": "Vertebral body signal and morphology"
                },
                "intervertebral_discs": {
                    "type": "text",
                    "description": "Disc findings by level"
                },
                "spinal_canal": {
                    "type": "text",
                    "description": "Canal stenosis"
                },
                "neural_foramina": {
                    "type": "text",
                    "description": "Foraminal narrowing"
                },
                "spinal_cord": {
                    "type": "text",
                    "description": "Cord signal and morphology"
                },
                "paraspinal": {
                    "type": "text",
                    "description": "Paraspinal soft tissues"
                }
            },
            "impression": {
                "type": "text",
                "description": "Summary of key findings"
            }
        }
    }
]
