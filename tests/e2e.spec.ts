import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('renders homepage correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('NE Transport')).toBeVisible()
    await expect(page.getByText('Move goods')).toBeVisible()
    await expect(page.getByRole('link', { name: /Book a Vehicle/i })).toBeVisible()
  })
  test('shows vehicle types on landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Tata Yodha')).toBeVisible()
    await expect(page.getByText('Bolero Pickup')).toBeVisible()
    await expect(page.getByText('Tata Ace')).toBeVisible()
  })
  test('navigates to booking from CTA', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Book a Vehicle/i }).click()
    await expect(page).toHaveURL('/booking')
  })
})

test.describe('Authentication', () => {
  test('renders login page', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  })
  test('switches between sign in and sign up', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByText('Sign up').click()
    await expect(page.getByText('Create account')).toBeVisible()
    await expect(page.getByPlaceholder('Your full name')).toBeVisible()
  })
  test('shows role selector on sign up', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByText('Sign up').click()
    await expect(page.getByText('Customer')).toBeVisible()
    await expect(page.getByText('Driver')).toBeVisible()
  })
  test('shows demo accounts section', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByText('Demo Accounts')).toBeVisible()
    await expect(page.getByText('Customer Demo')).toBeVisible()
    await expect(page.getByText('Driver Demo')).toBeVisible()
  })
  test('pre-fills demo credentials on click', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByText('Customer Demo').click()
    await expect(page.getByPlaceholder('you@example.com')).toHaveValue('customer@demo.com')
  })
})

test.describe('Booking Flow', () => {
  test('renders booking page step 1', async ({ page }) => {
    await page.goto('/booking')
    await expect(page.getByText('Where to?')).toBeVisible()
    await expect(page.getByPlaceholder('Pickup location')).toBeVisible()
    await expect(page.getByPlaceholder('Drop location')).toBeVisible()
  })
  test('shows location suggestions when typing', async ({ page }) => {
    await page.goto('/booking')
    await page.getByPlaceholder('Pickup location').fill('Paltan')
    await expect(page.getByText('Paltan Bazaar')).toBeVisible()
  })
  test('calculates distance after selecting locations', async ({ page }) => {
    await page.goto('/booking')
    await page.getByPlaceholder('Pickup location').fill('Paltan')
    await page.getByText('Paltan Bazaar').first().click()
    await page.getByPlaceholder('Drop location').fill('Dispur')
    await page.getByText('Dispur').first().click()
    await expect(page.getByText(/Estimated distance/i)).toBeVisible()
  })
  test('proceeds to vehicle selection', async ({ page }) => {
    await page.goto('/booking')
    await page.getByPlaceholder('Pickup location').fill('Paltan')
    await page.getByText('Paltan Bazaar').first().click()
    await page.getByPlaceholder('Drop location').fill('Dispur')
    await page.getByText('Dispur').first().click()
    await page.getByRole('button', { name: /Choose Vehicle/i }).click()
    await expect(page.getByText('Tata Yodha')).toBeVisible()
  })
  test('selects a vehicle and proceeds to confirm', async ({ page }) => {
    await page.goto('/booking')
    await page.getByPlaceholder('Pickup location').fill('Paltan')
    await page.getByText('Paltan Bazaar').first().click()
    await page.getByPlaceholder('Drop location').fill('Dispur')
    await page.getByText('Dispur').first().click()
    await page.getByRole('button', { name: /Choose Vehicle/i }).click()
    await page.getByText('Tata Yodha').first().click()
    await page.getByRole('button', { name: /Review Booking/i }).click()
    await expect(page.getByText('Confirm Booking')).toBeVisible()
    await expect(page.getByText('Fare Breakdown')).toBeVisible()
  })
  test('completes booking and shows success', async ({ page }) => {
    await page.goto('/booking')
    await page.getByPlaceholder('Pickup location').fill('Paltan')
    await page.getByText('Paltan Bazaar').first().click()
    await page.getByPlaceholder('Drop location').fill('Dispur')
    await page.getByText('Dispur').first().click()
    await page.getByRole('button', { name: /Choose Vehicle/i }).click()
    await page.getByText('Tata Yodha').first().click()
    await page.getByRole('button', { name: /Review Booking/i }).click()
    await page.getByRole('button', { name: /Book Now/i }).click()
    await expect(page.getByText('Booking Confirmed!')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Customer Dashboard', () => {
  test('renders customer dashboard', async ({ page }) => {
    await page.goto('/dashboard/customer')
    await expect(page.getByText('Book Now')).toBeVisible()
    await expect(page.getByText('Active')).toBeVisible()
    await expect(page.getByText('History')).toBeVisible()
  })
  test('shows booking stats', async ({ page }) => {
    await page.goto('/dashboard/customer')
    await expect(page.getByText('Trips')).toBeVisible()
  })
})

test.describe('Driver Dashboard', () => {
  test('renders driver dashboard', async ({ page }) => {
    await page.goto('/dashboard/driver')
    await expect(page.getByText('Driver Dashboard')).toBeVisible()
    await expect(page.getByText('Online')).toBeVisible()
  })
  test('shows today stats', async ({ page }) => {
    await page.goto('/dashboard/driver')
    await expect(page.getByText("Today's Earnings")).toBeVisible()
    await expect(page.getByText('Trips Done')).toBeVisible()
  })
  test('shows pending booking requests', async ({ page }) => {
    await page.goto('/dashboard/driver')
    await expect(page.getByText('New Requests')).toBeVisible()
    await expect(page.getByText('Accept Job')).toBeVisible()
  })
  test('can accept a booking', async ({ page }) => {
    await page.goto('/dashboard/driver')
    await page.getByRole('button', { name: /Accept Job/i }).first().click()
    await expect(page.getByText('Active Job')).toBeVisible({ timeout: 3000 })
  })
  test('can toggle online/offline', async ({ page }) => {
    await page.goto('/dashboard/driver')
    await page.getByText('Online').click()
    await expect(page.getByText('Offline')).toBeVisible()
    await page.getByRole('button', { name: /Go Online/i }).click()
    await expect(page.getByText('Online')).toBeVisible()
  })
})

test.describe('Admin Dashboard', () => {
  test('renders admin dashboard', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page.getByText('Admin Panel')).toBeVisible()
  })
  test('shows platform stats', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page.getByText('Total Users')).toBeVisible()
    await expect(page.getByText('Active Drivers')).toBeVisible()
    await expect(page.getByText('Total Bookings')).toBeVisible()
  })
  test('shows revenue chart', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page.getByText('Monthly Revenue')).toBeVisible()
  })
  test('switches to bookings tab', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await page.getByRole('button', { name: 'bookings' }).click()
    await expect(page.getByText('Today')).toBeVisible()
  })
  test('switches to drivers tab', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await page.getByRole('button', { name: 'drivers' }).click()
    await expect(page.getByText('Pending Approvals')).toBeVisible()
  })
})

test.describe('Driver Documents', () => {
  test('renders document upload page', async ({ page }) => {
    await page.goto('/dashboard/driver/documents')
    await expect(page.getByText('Upload Documents')).toBeVisible()
    await expect(page.getByText("Driver's License")).toBeVisible()
    await expect(page.getByText('Vehicle Registration')).toBeVisible()
  })
})
