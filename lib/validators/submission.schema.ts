import { z } from 'zod'

export const submissionSchema = z.object({
  farmerName: z.string().min(1, 'Pangalan ay kailangan'),
  municipality: z.enum([
    'Baguio City',
    'La Trinidad',
    'Itogon',
    'Sablan',
    'Tuba',
    'Tublay',
  ]),
  barangay: z.string().min(1),
  contactNumber: z.string().optional(),
  cropCategory: z.enum([
    'LEAFY_VEGETABLES',
    'FRUITING_VEGETABLES',
    'ROOT_CROPS',
    'HIGH_VALUE_CROPS',
  ]),
  cropName: z.string().min(1),
  customCrop: z.string().optional(),
  plantingDate: z.string().datetime({ offset: true }).or(z.string().date()),
  harvestDate: z.string().datetime({ offset: true }).or(z.string().date()),
  farmSizeHectares: z.number().positive().optional(),
  farmSizeSqm: z.number().positive().optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  photoUrl: z.string().url().optional(),
  issues: z.array(z.string()).default([]),
})

export type SubmissionInput = z.infer<typeof submissionSchema>
